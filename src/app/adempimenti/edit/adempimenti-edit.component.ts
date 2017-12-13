import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { APICommonService } from "../../_services/index";
import { AppConfig } from "../../app.config";

import { Adempimenti } from "../../_models/adempimenti";
import { Cipe } from "../../_models/cipe";
import { Delibere } from "../../_models/delibere";

import * as _ from "lodash";
import * as moment from 'moment';

@Component({
    templateUrl: 'adempimenti-edit.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AdempimentiEditComponent implements OnInit {

    public model: any = {};
    public error = '';
    public mode: string;
    private loading = false;

    private id: number;

    public esitoSelect2 = [
        { id: 0, text: '', class: ''},
        { id: 1, text: 'Ottemperato', class: 'bg-ottemperato'},
        { id: 2, text: 'Superato', class: 'bg-superato'},
        { id: 3, text: 'Esaurito', class: 'bg-esaurito'}
    ];

public filter = {
      data_cipe: null
    };

    public cipe$: Observable<Cipe[]>;
    public delibere$: Observable<Delibere[]>;
    public adempimenti_ambiti$: Observable<any[]>;
    public adempimenti_tipologie$: Observable<any[]>;
    public adempimenti_azioni$: Observable<any[]>;
    public adempimenti_soggetti$: Observable<any[]>;
    public uffici$: Observable<any[]>;


    public datePickerOptions: any;
    public select2Options: Select2Options;
    private select2Debounce: boolean = false;

    public canEdit: boolean = false;
    public canDelete: boolean = false;
    public canReadDelibere: boolean = false;

    public periodicitaSelect2 = [
        { id: 1, text: '1 - Annuale', add_months: 12 },
        { id: 2, text: '2 - Semestrale', add_months: 6 },
        { id: 3, text: '3 - Quadrimestrale', add_months: 4 },
        { id: 4, text: '4 - Trimestrale', add_months: 3 },
        { id: 6, text: '6 - Bimestrale', add_months: 2 },
        { id: 12, text: '12 - Mensile', add_months: 1 }
    ];

    public scadenze = [];

    constructor(private router: Router,
                private route: ActivatedRoute,
                public apiService: APICommonService,
                public config: AppConfig,
    ) {

        this.cipe$ = this.apiService.subscribeToDataService('cipe');
        this.delibere$ = this.apiService.subscribeToDataService('delibere');
        this.adempimenti_ambiti$ = this.apiService.subscribeToDataService('adempimenti_ambiti');
        this.adempimenti_tipologie$ = this.apiService.subscribeToDataService('adempimenti_tipologie');
        this.adempimenti_azioni$ = this.apiService.subscribeToDataService('adempimenti_azioni');
        this.adempimenti_soggetti$ = this.apiService.subscribeToDataService('adempimenti_soggetti');
        this.uffici$ = this.apiService.subscribeToDataService('uffici');

    }

    ngOnInit() {
        this.load();
    }

    load() {
        this.apiService.refreshCommonCache();

        this.id = +this.route.snapshot.params['id'];
        this.mode = isNaN(this.id) ? 'create' : 'update';
        this.canEdit = isNaN(this.id) ? this.apiService.userCan('CREATE_ADEMPIMENTI') : this.apiService.userCan('EDIT_ADEMPIMENTI');
        this.canDelete = this.apiService.userCan('DELETE_ADEMPIMENTI');
        this.canReadDelibere = this.apiService.userCan('READ_DELIBERE');

        switch (this.mode) {
            case 'create':
                this.model = new Adempimenti();
                break;

            case 'update':
                this.apiService.getById('adempimenti', this.id)
                    .subscribe(
                        response => {
/*                            console.log('-----------------------------------------------------');
                            console.log('scadenze ricevute dalla API');
                            console.log(response.data.scadenze);
                            console.log('-----------------------------------------------------');*/
                            this.model = response.data;

                            // instantiate every date
                            _.forEach(this.model, (value, key) => {
                                if(key && key.indexOf('data') !== -1) {
                                    if(value) {
                                        let d = new Date(value);
                                        d.setHours(0,0,0,0);
                                        this.model[key] = d;
                                    }
                                }
                            });

                            this.generateVirtualScadenze();
                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;
        }
    }

    reload() {
        this.load();
    }

    cancel(event) {
        this.router.navigate(['/app/adempimenti/list']);
    }

    submit(event: any, form: any) {
        //console.log(event, form);
        this.loading = true;



        let post = $.extend(true, new Adempimenti(), this.model);

        // instantiate every date
        _.forEach(post, (value, key) => {
            if(key && key.indexOf('data') !== -1) {
                if(value) {
                    let d = new Date(value);
                    d.setHours(0,0,0,0);
                    post[key] = d;
                }
            }
        });

        post.scadenze = _.filter(post.scadenze, function(o) { return o.modified || o.id });

        switch (this.mode) {
            case 'create':
                this.apiService.create('adempimenti', post)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/adempimenti/list']);
                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;

            case 'update':
                this.apiService.update('adempimenti', post)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/adempimenti/list']);
                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;
        }
    }

    private generateVirtualScadenze() {

        let dateCursor = null;

        const loop = this.model.periodicita * this.model.pluriennalita;
        const monthsIncrement = 12/this.model.periodicita;
        let scadenze = [];

        for(let i=0; i<loop; i++) {
            dateCursor = moment(this.model.data_scadenza).add(monthsIncrement*i, 'month');
            scadenze.push( {id: null, id_adempimenti: this.model.id, data: dateCursor.valueOf(), stato: 0, note: ''} );
        }


        let merge = _.unionBy(this.model.scadenze, scadenze, "data");
        //console.log(this.model.scadenze, scadenze, merge);
        merge = _.sortBy(merge, ['data']);
        this.model.scadenze = merge;
    }

    public checkIdCipe() {
        if(!this.model.id_cipe && this.model.id_delibere) {
            const id_cipe = this.getCipeIdByDate(this.getDeliberaDateById(this.model.id_delibere));
            if(id_cipe) {
                this.model.id_cipe = id_cipe;
            }
        }
    }

    public getDeliberaDateById(id) {
        //console.log('getDeliberaDateById');
        if(id) {
            return _.get( this.apiService.dataEnum, 'delibere["' + id + '"]data', '');
        }
        return null;
    }

    public getCipeIdByDate(date) {
        //console.log('getCipeIdByDate');
        let item = null;
        if(date) {
            item = _.find(this.apiService.dataEnum.cipe, function(o) { return o.data === date; });
        }

        if(item && item.id) {
            return item.id;
        }
        return null;
    }

    public select2Changed(e: any, name: string): void {

        if (this.select2Debounce) {
            this.select2Debounce = false;
            return;
        }

        if(name === 'id_cipe' && e.value !== null) {
            this.select2Debounce = true;
            const id = e.value;
            const data_cipe = _.get( this.apiService.dataEnum, 'cipe["' + id + '"]data', '');
            this.filter.data_cipe = data_cipe;

            //console.log(e.value, data_cipe);
        }

        if(name === 'id_soggetti' && e.value !== null) {
            this.select2Debounce = true;

            let V = e.value;
            let selectedCount = 0;
            if ( Array.isArray(this.model[name]) ) {
                selectedCount = this.model[name].length;
            } else {
                selectedCount = this.model[name] ? this.model[name].split(',').length : 0;
            }

            if (V.length > selectedCount) {
                // Value added
                // console.log('value added', V);
                this.mayBeCreateNewSelect2Values(name, V, 'adempimenti_soggetti');

            } else if (V.length < selectedCount) {
                // Value removed
                // console.log('value removed', V);

            } else if (V.join(',') !== this.model[name]) {
                // console.log('value changed', V);
                this.mayBeCreateNewSelect2Values(name, V, 'adempimenti_soggetti');
            }
        }

        this.model[name] = e.value;
    }

    mayBeCreateNewSelect2Values(name, V, apiPath) {

        let newValues = [];

        for(let i=0; i<V.length; i++) {
            if(V[i] != '' && !this.apiService.dataEnum[apiPath][V[i]]) {
                // value doesn't exist
                // console.log("Value '"+V[i]+"' doesn't exist");
                newValues.push(V[i]);
            }
        }

        // const newValues = $('#' + name + ' select option[data-select2-tag="true"]');

        if (newValues.length) {

            // console.log(apipath);

            newValues.forEach((elem) => {

                this.apiService.create(apiPath, { 'denominazione': elem } )
                    .subscribe(
                        response => {

                            this.apiService.refreshCommonCache();

                            const id = response.id,
                                den = response.denominazione;

                            const label = id + ' - ' + den;
                            response.text = label;

                            // creates the new entry on the relative apiService select2 data
                            // this.apiService[apipath + 'Select'].push(response.data);

                            // find the select element and update temporary id with the new assigned id
                            $('#' + name + ' select option[value="' + den + '"]').val(id).text(label);

                            // replace the temporary id in the model with the new assigned id
                            const selectedValues = this.model[name];
                            //console.log('before',selectedValues);

                            const i = _.indexOf(selectedValues, _.find(selectedValues, den));
                            selectedValues.splice(i, 1, String(id));
                            //console.log('after',selectedValues);

                            this.select2Debounce = true;
                            if( Array.isArray(this.model[name])) {
                                this.model[name] = selectedValues;
                            } else {
                                this.model[name] = selectedValues.join(',');
                            }

                            // update select2 data
                            // $('#'+name+' select').select2('data',response.data, true);

                            // find the select2 choice and update the temporary label with the new assigned id
                            // $('#'+name+' .select2-selection__choice[title="'+den+'"]').prop('title',label);
                        },
                        error => {
                            this.error = error; console.log(error);
                        });
            });
        }
    };

    public checkScadenzaRequired () {
        if(this.model.data_scadenza || this.model.giorni_scadenza || this.model.mesi_scadenza || this.model.anni_scadenza ) {
            return null;
        }
        return 'required';
    }

    private jwt() {
        // get jwt token
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            return currentUser.token;
        }
    }

}
