import {Component, OnInit} from "@angular/core";
import {FormControl} from "@angular/forms";
import {Router} from "@angular/router";

import {Observable} from "rxjs/Observable";
// import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/throttleTime";

import * as _ from 'lodash';
import * as moment from 'moment';

import {APICommonService} from "../../_services/index";
import {AppConfig} from "../../app.config";

import {Adempimenti} from "../../_models/adempimenti";
import {AdempimentiScadenze} from "../../_models/adempimenti_scadenze";
import {Cipe} from "../../_models/cipe";
import {Uffici} from "../../_models/uffici";
import {BehaviorSubject} from "rxjs/BehaviorSubject";


@Component({
    templateUrl: 'adempimenti-list.component.html',
})
export class AdempimentiListComponent implements OnInit {

    public filter = {
        id: null,
        descrizione: '',
        numero_delibera: null,
        data_da: null,
        data_a: null,
        id_situazione: null,
        anno_delibera: null,
        data_cipe: null,
        codice_esito: null
    };

    public today = new Date().getTime();
    private today_M = moment();
    private imminent_M = moment().add(3, 'month');

    public firstYear = 1998;
    public currentYear = new Date().getFullYear();
    public years: number[] = [];

    public keysGetter = Object.keys;
    public Math = Math;
    public viewtype: string = 'normal';

    public adempimenti_V$;
    private dataPrepared = false;

    public adempimenti: any[];
    public adempimenti_scadenze: any[];

    public scadenze_ottemperate = {};
    public adempimenti_scaduti = {};
    public adempimenti_imminenti = {};
    public adempimenti_futuri = {};


    public codiceEsitoEnum = {
        0: { label: '', class: ''},
        1: { label: 'Ottemperato', class: 'bg-ottemperato'},
        2: { label: 'Superato', class: 'bg-superato'},
        3: { label: 'Esaurito', class: 'bg-esaurito'},
        10: { label: 'Attivo', class: 'bg-attivo'},
        11: { label: 'In scadenza', class: 'bg-in_scadenza'},
        12: { label: 'Scaduto', class: 'bg-scaduto'},
        //13: { label: 'Parzialmente ottemperato', class: 'bg-parzialmente_ottemperato'}
    };

    public esitoSelect2 = [
        { id: 0, text: ''},
        { id: 1, text: 'Ottemperato' },
        { id: 2, text: 'Superato' },
        { id: 3, text: 'Esaurito' },
        { id: 10, text: 'Attivo' },
        { id: 11, text: 'In scadenza' },
        { id: 12, text: 'Scaduto' },
        //{ id: 13, text: 'Parzialmente ottemperato' }
    ];

    public periodicitaEnum = {
        1: 'Annuale',
        2: 'Semestrale',
        3: 'Quadrimestrale',
        4: 'Trimestrale',
        6: 'Bimestrale',
        12: 'Mensile'
    };


    deletingAdempimenti: Adempimenti = new Adempimenti;

    public adempimenti$: Observable<Adempimenti[]>;
    public adempimenti_ambiti$: Observable<any[]>;
    public adempimenti_azioni$: Observable<any[]>;
    public adempimenti_soggetti$: Observable<any[]>;
    public adempimenti_tipologie$: Observable<any[]>;
    public adempimenti_scadenze$: Observable<AdempimentiScadenze[]>;
    public uffici$: Observable<Uffici[]>;
    public cipe$: Observable<Cipe[]>;


    public filteredCount = {count: 0};

    public select2Options: Select2Options;
    private select2Debounce = false;
    public descrizioneControl = new FormControl();

    public canDelete: boolean = false;

    constructor(public apiService: APICommonService,
                private router: Router,
                private config: AppConfig
    ) {
        this.select2Options = config.select2Options;

        for (let i = this.currentYear; i >= this.firstYear; i--) {
            this.years.push(i);
        }

        this.adempimenti_V$ = <BehaviorSubject<any[]>> new BehaviorSubject([]);

        this.adempimenti$ = this.apiService.subscribeToDataService('adempimenti');
        this.adempimenti_scadenze$ = this.apiService.subscribeToDataService('adempimenti_scadenze');
        this.adempimenti_ambiti$ = this.apiService.subscribeToDataService('adempimenti_ambiti');
        this.adempimenti_azioni$ = this.apiService.subscribeToDataService('adempimenti_azioni');
        this.adempimenti_soggetti$ = this.apiService.subscribeToDataService('adempimenti_soggetti');
        this.adempimenti_tipologie$ = this.apiService.subscribeToDataService('adempimenti_tipologie');

        this.uffici$ = this.apiService.subscribeToDataService('uffici');
        this.cipe$ = this.apiService.subscribeToDataService('cipe');

        this.adempimenti$.subscribe( adempimenti => { this.adempimenti = adempimenti; this.prepareData() });
        this.adempimenti_scadenze$.subscribe( adempimenti_scadenze => { this.adempimenti_scadenze = adempimenti_scadenze; this.prepareData() });
    }

    ngOnInit() {
        // debounce keystroke events
        this.descrizioneControl.valueChanges.debounceTime(400).subscribe(newValue => this.filter.descrizione = newValue);
        this.apiService.refreshCommonCache();

        this.canDelete = this.apiService.userCan('DELETE_ADEMPIMENTI');
    }

    askDeleteAdempimenti(event: any, modal: any, adempimenti: Adempimenti) {
        event.stopPropagation();
        this.deletingAdempimenti = adempimenti;
        modal.open();
    }

    editId(id: number) {
        this.router.navigate(['/app/adempimenti/edit/' + id]);
    }

    editDelibereId(id:number) {
        this.router.navigate(['/app/delibere/edit/' + id]);
    }

    confirmDeleteAdempimenti(modal: any) {
        modal.close();
        this.deleteAdempimenti(this.deletingAdempimenti.id);
        this.deletingAdempimenti = new Adempimenti;
    }

    deleteAdempimenti(id: number) {
        this.apiService.delete('adempimenti', id).subscribe(() => {
            // this.loadAllAdempimenti()
            this.apiService.refreshCommonCache();
        });
    }

    public select2Changed(e: any, name: string): void {

        if (this.select2Debounce) {
            this.select2Debounce = false;
            return;
        }

        this.filter[name] = e.value;
    }

    public onYearChanged(year) {

        this.filter.data_cipe = null;
        this.filter.anno_delibera = year;

        if(year !== '') {
            let data_da = new Date();
            data_da.setFullYear(year,0,1);

            let data_a = new Date();
            data_a.setFullYear(year,11,31);

            this.filter.data_da = data_da;
            this.filter.data_a = data_a;
        } else {
            this.filter.data_da = null;
            this.filter.data_a = null;
        }
    }

    public onDataCipeChanged(date) {

        this.filter.data_cipe = date;
        this.filter.anno_delibera = null;

        if(date !== '') {
            let data_da = new Date();
            data_da.setTime(date);

            let data_a = new Date();
            data_a.setTime(date);

            this.filter.data_da = data_da;
            this.filter.data_a = data_a;
        } else {
            this.filter.data_da = null;
            this.filter.data_a = null;
        }
    }

    public onFilterChanged(value, type) {
        this.filter[type] = value;
    }

    public resetFilters(event): void {
        event.stopPropagation();
        this.filter = {
            id: null,
            descrizione: '',
            numero_delibera: null,
            data_da: null,
            data_a: null,
            id_situazione: null,
            anno_delibera: null,
            data_cipe: null,
            codice_esito: null
        };
    }

    public countDaysFromToday(date: number): number {
        let days = Math.floor((this.today - date)/86400000);
        return days;
    }

    getEsito(adempimento: Adempimenti): number {
        if(adempimento.codice_esito < 1 && adempimento.data_scadenza) {

            if(this.today > adempimento.data_scadenza) {
                return 12;
            } else if(adempimento.data_scadenza &&  (adempimento.data_scadenza - 15768000000) < this.today ) {
                // 15768000000 = 6 months in milliseconds
                return 11;
            } else {
                return 10;
            }
        } else if (adempimento.codice_esito > 0) {
            return adempimento.codice_esito;
        } else {
            return 10;
        }
    }

    prepareData(): boolean {

        this.decorateScadenze(this.adempimenti_scadenze);
        this.decorateAdempimenti(this.adempimenti);

        this.adempimenti_V$.next(this.adempimenti);

        return true;
    }

    decorateAdempimenti (adempimenti) {

        this.adempimenti_scaduti = {};
        this.adempimenti_imminenti = {};
        this.adempimenti_futuri = {};

        //console.log('decorateAdempimenti');
        _.forEach(adempimenti, (adempimento) => {

            const delibera = _.get( this.apiService.dataEnum, 'delibere["' + adempimento.id_delibere + '"]', '');
            if(delibera) {
                adempimento.data_delibera = delibera.data;
                adempimento.numero_delibera = delibera.numero;
                adempimento.argomento_delibera = delibera.argomento;
            }

            this.generateVirtualScadenze(adempimento);
        });

        this.adempimenti = adempimenti;
        return adempimenti;
    }

    decorateScadenze (scadenze) {
        //console.log('decorateScadenze');

        this.scadenze_ottemperate = {};

        _.forEach(scadenze, (scadenza) => {
            if(scadenza.stato > 0) {
                this.scadenze_ottemperate[scadenza.data] = this.scadenze_ottemperate[scadenza.data] || {};
                this.scadenze_ottemperate[scadenza.data][scadenza.id_adempimenti] = true;
            }
            //console.log(this.apiService.dataEnum['adempimenti'][scadenza.id]);
        });

        //this.adempimenti_scadenze = scadenze;

        //console.log('scadenze_ottemperate',this.scadenze_ottemperate);

        //return scadenze;
    }

    private generateVirtualScadenze(adempimento: Adempimenti) {

// console.log(adempimento.data_scadenza);

        let dateCursor = null;

        const loop = adempimento.periodicita * adempimento.pluriennalita;
        const monthsIncrement = 12/adempimento.periodicita;

        this.adempimenti_scaduti[adempimento.id] = [];
        this.adempimenti_imminenti[adempimento.id] = [];
        this.adempimenti_futuri[adempimento.id] = [];



        adempimento.codice_esito = 0;
        adempimento.scaduti = 0;
        adempimento.ottemperati = 0;
        adempimento.totale_scadenze = loop;

        for(let i=0; i<loop; i++) {

            dateCursor = moment(adempimento.data_scadenza).add(monthsIncrement*i, 'month');

            if(dateCursor.isBefore(this.today_M)) {
                adempimento.scaduti++;
            }

            if(this.scadenze_ottemperate[dateCursor.valueOf()] && this.scadenze_ottemperate[dateCursor.valueOf()][adempimento.id]) {
                adempimento.ottemperati++;
                adempimento.codice_esito = 1;
                adempimento.time_diff = null;

            } else if(dateCursor.isBefore(this.today_M)) {

                this.adempimenti_scaduti[adempimento.id].push(dateCursor.valueOf());
                adempimento.codice_esito = adempimento.codice_esito  || 12;
                adempimento.time_diff = dateCursor.diff(this.today_M, 'days');

            } else if (dateCursor.isBefore(this.imminent_M)){

                this.adempimenti_imminenti[adempimento.id].push(dateCursor.valueOf());
                adempimento.codice_esito = adempimento.codice_esito  || 11;

                adempimento.time_diff = adempimento.time_diff || dateCursor.diff(this.today_M, 'days');

            } else {

                this.adempimenti_futuri[adempimento.id].push(dateCursor.valueOf());
                adempimento.codice_esito = adempimento.codice_esito  || 10;
                //adempimento.time_diff = this.today_M.diff(dateCursor, 'days');
            }
        }

        if(adempimento.ottemperati === adempimento.totale_scadenze) {
            adempimento.codice_esito = 3;
        } else if(adempimento.superato) {
            adempimento.codice_esito = 2;
            adempimento.time_diff = null;
        }
    }

}

/*    public codiceEsitoEnum = {
        0: { label: '', class: ''},
        1: { label: 'Ottemperato', class: 'bg-ottemperato'},
        2: { label: 'Superato', class: 'bg-superato'},
        3: { label: 'Esaurito', class: 'bg-esaurito'},
        10: { label: 'Attivo', class: 'bg-attivo'},
        11: { label: 'In scadenza', class: 'bg-in_scadenza'},
        12: { label: 'Scaduto', class: 'bg-scaduto'},
        13: { label: 'Parzialmente ottemperato', class: 'bg-parzialmente_ottemperato'}
    };
*/
