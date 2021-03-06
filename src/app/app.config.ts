import { Injectable } from '@angular/core';
declare const jQuery: any;

@Injectable()
export class AppConfig {

    constructor( ) {
        this._initResizeEvent();
        this._initOnScreenSizeCallbacks();
    }

    getConfig(): Object {
        return this.config;
    }

    query: any;

    config = {
        name: 'mosic 2.0',
        title: 'Mo.Si.C. - Monitoraggio Sistema CIPE',
	    version: '2.0.0-beta.1',

	// development
	// baseAPIURL: 'http://localhost:8080/mosic2-service',

	// staging tdrynx.com
	    baseAPIURL: 'http://mosicapi.tdrynx.info',
	
	// staging celata.com
	// baseAPIURL: 'http://mosic2.celata.com/service',

	// production
	// baseAPIURL: 'http://mosic2.pcm.it/service',

        /**
         * Whether to print and alert some log information
         */
        debug: false,
        /**
         * In-app constants
         */
        settings: {
            colors: {
                'white': '#fff',
                'black': '#000',
                'gray-light': '#999',
                'gray-lighter': '#eee',
                'gray': '#666',
                'gray-dark': '#343434',
                'gray-darker': '#222',
                'gray-semi-light': '#777',
                'gray-semi-lighter': '#ddd',
                'brand-primary': '#5d8fc2',
                'brand-success': '#64bd63',
                'brand-warning': '#f0b518',
                'brand-danger': '#dd5826',
                'brand-info': '#5dc4bf'
            },
            screens: {
                'xs-max': 543,
                'sm-min': 544,
                'sm-max': 767,
                'md-min': 768,
                'md-max': 991,
                'lg-min': 992,
                'lg-max': 1199,
                'xl-min': 1200
            },
            navCollapseTimeout: 2500
        },

        /**
         * Application state. May be changed when using.
         * Synced to Local Storage
         */
        state: {
            /**
             * whether navigation is static (prevent automatic collapsing)
             */
            'nav-static': false
        }
    };

    supportedAPIPaths = [
        {
            apipath: 'adempimenti_ambiti',
            labels: ['Ambito', 'Ambiti'],
            sort_by: 'denominazione', sort_order: 'asc', intro: 'Tutti gli',
            new_label: 'Nuovo',
            editable: true,
            columns: [
                ////{field: 'id', text: '#'},
                // {field: 'codice', text: 'Codice', edit_width: 2 },
                {field: 'denominazione', text: 'Denominazione', edit_width: 12, required: true},
                {field: 'note', text: 'Note', edit_width: 12, required: false}
            ]
        },
        {
            apipath: 'adempimenti_azioni',
            labels: ['Azione', 'Azioni'],
            sort_by: 'denominazione', sort_order: 'asc', intro: 'Tutte le',
            new_label: 'Nuova',
            editable: true,
            columns: [
                //{field: 'id', text: '#'},
                // {field: 'codice', text: 'Codice', edit_width: 2 },
                {field: 'denominazione', text: 'Denominazione', edit_width: 12, required: true},
                {field: 'note', text: 'Note', edit_width: 12, required: false}
            ]
        },
        {
            apipath: 'adempimenti_tipologie',
            labels: ['Tipologia', 'Tipologie'],
            sort_by: 'denominazione', sort_order: 'asc', intro: 'Tutte le',
            new_label: 'Nuova',
            editable: true,
            columns: [
                ////{field: 'id', text: '#'},
                // {field: 'codice', text: 'Codice', edit_width: 2 },
                {field: 'denominazione', text: 'Denominazione', edit_width: 12, required: true},
                {field: 'note', text: 'Note', edit_width: 12, required: false}
            ]
        },
        {
            apipath: 'adempimenti_soggetti',
            labels: ['Soggetto', 'Soggetti'],
            sort_by: 'denominazione', sort_order: 'asc', intro: 'Tutti i',
            new_label: 'Nuovo',
            editable: true,
            columns: [
                //{field: 'id', text: '#'},
                // {field: 'codice', text: 'Codice', edit_width: 2 },
                {field: 'denominazione', text: 'Denominazione', edit_width: 12, required: true},
                {field: 'note', text: 'Note', edit_width: 12, required: false}
            ]
        }
    ];

    public isPathSupported(apipath: string): number {

        let found = -1;
        if (apipath.indexOf('/') !== -1) {
            apipath = apipath.split('/')[2]
        }

        // console.log('check', apipath);
        for (let i = 0, l = this.supportedAPIPaths.length; i < l; i++) {
            // console.log('checking', this.supportedAPIPaths[i].apipath);
            // console.log('url: ' + apipath, 'supported: ' + this.supportedAPIPaths[i].apipath );
            if (this.supportedAPIPaths[i].apipath === apipath) {
                found = i;
                // console.log(apipath, '>>>>>>> Supported!', found);
                break;
            }
        }

        return found;
    }

    dateTimeOptions = {
        language: 'it', icon: 'fa fa-calendar', todayBtn: 'linked', todayHighlight: true, placeholder:'Scegli data', autoclose: true, clearBtn: true
    };

    // basic Select2 options
    select2Options = {
        theme: 'bootstrap',
        placeholder: 'Inizia a scrivere per selezionare...',
        // allowClear: true, // <-- not yet available for a bug in ng2-select2 as of version 1.0.0-beta.10
        // query: (q) => { console.log(q); return q; },
        templateResult: (item) => {
            // No need to template the searching text
            if (item.loading) {
                return item.text;
            }

            const term = this.query.term || '';
            const $result = this.markMatch(item.text, term);

            return $result;
        },
        language: {
            searching: (params) => {
                // Intercept the query as it is happening
                this.query = params;
                return 'Ricerca...';
            },
            noResults: function(){
                return '<strong>Nessuna corrispondenza trovata</strong>';
            }
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        matcher: (term: string, text: string, option: any): boolean => {

            if (term.trim() === '') {
                return true;
            }

            // multi token case insensitive search
            const keywords = term.split(' ');
            for (let i = 0; i < keywords.length; i++) {
                if ((text.toUpperCase()).indexOf((keywords[i]).toUpperCase()) === -1) {
                    return false;
                }
            }
            return true;
        }
    };

    // deep clone basic Select2 options and add multiple flag
    select2OptionsMulti = $.extend(true, {}, this.select2Options, { multiple: true } );

    // deep clone basic Select2 options and add functions to prepare for "tags" (or whatever) creation
    select2WithAddOptions = $.extend(true, {}, this.select2Options, {
        tags: true,
        minimumInputLength: 3,
        language: {
            inputTooShort: function (args) {
                const remainingChars = args.minimum - args.input.length;

                const message = 'Inserisci ' + remainingChars + ' o più caratteri';

                return message;
            }
        },
        insertTag: (data, tag) => {
            //console.log("select2WithAddOptions['insertTag']", data.length);

            let markup = '';
            if (data.length === 0) {
                markup += '<strong>Nessuna corrispondenza trovata</strong><br/>';
            }
            markup += '<h5><i class="fa fa-plus-circle"> </i> Aggiungi <strong>' + tag.text + '</strong></h5>';
            tag.text = markup;
            data.push(tag);

            // this.changeDetectionRef.detectChanges();
        },
        createTag: (tag) => {
            // console.log("select2WithAddOptions['createTag']");
            return {
                id: tag.term,
                text: tag.term,
                isNew: true
            };
        }
    });

    // deep clone select2WithAddOptions and add multiple option
    select2WithAddOptionsMulti = $.extend(true, {}, this.select2WithAddOptions, { multiple: true } );

    datePickerOptions = {
        language: 'it',
        icon: 'fa fa-calendar',
        todayBtn: 'linked',
        todayHighlight: true,
        placeholder: 'Scegli data',
        autoclose: true,
/*        format: {
            toDisplay: function (date, format, language) {
                console.log('toDisplay',date, format, language);
                return new Date().toLocaleString('it-IT')
                //return date;
            },
            toValue: function (date, format, language) {
                console.log('toValue',date, format, language);
                //return new Date(date).getTime();
                return new Date().toLocaleString('it-IT')
                //return date;
            }
        }*/
    };

    _resizeCallbacks = [];
    _screenSizeCallbacks = {
        xs: {enter: [], exit: []},
        sm: {enter: [], exit: []},
        md: {enter: [], exit: []},
        lg: {enter: [], exit: []},
        xl: {enter: [], exit: []}
    };

    notify(): any {

    }

    markMatch(text: string, term: string): any {
        let res, reg, words = [];
        const val = $.trim(term.replace(/[<>]?/g, ''));
        if (val.length > 0) {
            words = val.split(' ');
            reg = new RegExp('(?![^<]+>)(' + words.join('|') + ')', 'ig');
            res = text.replace(reg, '<span class="select2-rendered__match">$&</span>');
        }
        return words.length > 0 ? $('<span>' + res + '</span>') : $('<span>' + text + '</span>');

    }

    isScreen(size): boolean {
        const screenPx = window.innerWidth;
        return (screenPx >= this.config.settings.screens[size + '-min'] || size === 'xs')
            && (screenPx <= this.config.settings.screens[size + '-max'] || size === 'xl');
    }

    getScreenSize(): string {
        const screenPx = window.innerWidth;
        if (screenPx <= this.config.settings.screens['xs-max']) {
            return 'xs';
        }
        if ((screenPx >= this.config.settings.screens['sm-min'])
            && (screenPx <= this.config.settings.screens['sm-max'])) {
            return 'sm';
        }
        if ((screenPx >= this.config.settings.screens['md-min'])
            && (screenPx <= this.config.settings.screens['md-max'])) {
            return 'md';
        }
        if ((screenPx >= this.config.settings.screens['lg-min'])
            && (screenPx <= this.config.settings.screens['lg-max'])) {
            return 'lg';
        }
        if (screenPx >= this.config.settings.screens['xl-min']) {
            return 'xl';
        }
    }

    onScreenSize(size, fn, /* Boolean= */ onEnter): void {
        onEnter = typeof onEnter !== 'undefined' ? onEnter : true;
        if (typeof size === 'object') {
            for (let i = 0; i < size.length; i++) {
                this._screenSizeCallbacks[size[i]][onEnter ? 'enter' : 'exit'].push(fn);
            }
        } else {
            this._screenSizeCallbacks[size][onEnter ? 'enter' : 'exit'].push(fn);
        }

    }

    changeColor(color, ratio, darker): string {
        const pad = function (num, totalChars): number {
            const padVal = '0';
            num = num + '';
            while (num.length < totalChars) {
                num = padVal + num;
            }
            return num;
        };
        // Trim trailing/leading whitespace
        color = color.replace(/^\s*|\s*$/, '');

        // Expand three-digit hex
        color = color.replace(
            /^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i,
            '#$1$1$2$2$3$3'
        );

        // Calculate ratio
        const difference = Math.round(ratio * 256) * (darker ? -1 : 1),
            // Determine if input is RGB(A)
            rgb = color.match(new RegExp('^rgba?\\(\\s*' +
                '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
                '\\s*,\\s*' +
                '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
                '\\s*,\\s*' +
                '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
                '(?:\\s*,\\s*' +
                '(0|1|0?\\.\\d+))?' +
                '\\s*\\)$'
                , 'i')),
            alpha = !!rgb && rgb[4] !== null ? rgb[4] : null,

            // Convert hex to decimal
            decimal = !!rgb ? [rgb[1], rgb[2], rgb[3]] : color.replace(
                    /^#?([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])/i,
                    function (): string {
                        return parseInt(arguments[1], 16) + ',' +
                            parseInt(arguments[2], 16) + ',' +
                            parseInt(arguments[3], 16);
                    }
                ).split(/,/);

        // Return RGB(A)
        return !!rgb ?
            'rgb' + (alpha !== null ? 'a' : '') + '(' +
            Math[darker ? 'max' : 'min'](
                parseInt(decimal[0], 10) + difference, darker ? 0 : 255
            ) + ', ' +
            Math[darker ? 'max' : 'min'](
                parseInt(decimal[1], 10) + difference, darker ? 0 : 255
            ) + ', ' +
            Math[darker ? 'max' : 'min'](
                parseInt(decimal[2], 10) + difference, darker ? 0 : 255
            ) +
            (alpha !== null ? ', ' + alpha : '') +
            ')' :
            // Return hex
            [
                '#',
                pad(Math[darker ? 'max' : 'min'](
                    parseInt(decimal[0], 10) + difference, darker ? 0 : 255
                ).toString(16), 2),
                pad(Math[darker ? 'max' : 'min'](
                    parseInt(decimal[1], 10) + difference, darker ? 0 : 255
                ).toString(16), 2),
                pad(Math[darker ? 'max' : 'min'](
                    parseInt(decimal[2], 10) + difference, darker ? 0 : 255
                ).toString(16), 2)
            ].join('');
    }

    lightenColor(color, ratio): any {
        return this.changeColor(color, ratio, false);
    }

    darkenColor(color, ratio): any {
        return this.changeColor(color, ratio, true);
    }

    max(array): any {
        return Math.max.apply(null, array);
    }

    min(array): any {
        return Math.min.apply(null, array);
    }

    _initResizeEvent(): void {
        let resizeTimeout;

        jQuery(window).on('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                jQuery(window).trigger('sn:resize');
            }, 100);
        });
    }

    _initOnScreenSizeCallbacks(): void {
        let resizeTimeout,
            prevSize = this.getScreenSize();

        jQuery(window).resize(() => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const size = this.getScreenSize();
                if (size !== prevSize) { // run only if something changed
                    // run exit callbacks first
                    this._screenSizeCallbacks[prevSize].exit.forEach((fn) => {
                        fn(size, prevSize);
                    });
                    // run enter callbacks then
                    this._screenSizeCallbacks[size].enter.forEach((fn) => {
                        fn(size, prevSize);
                    });
                    // console.log('screen changed. new: ' + size + ', old: ' + prevSize);
                }
                prevSize = size;
            }, 100);
        });
    }
}

