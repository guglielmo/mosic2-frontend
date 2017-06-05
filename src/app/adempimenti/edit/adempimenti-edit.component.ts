import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { APICommonService } from "../../_services/index";
import { AppConfig } from "../../app.config";

import { Adempimenti } from "../../_models/adempimenti";
import { Cipe } from "../../_models/cipe";
import { Delibere } from "../../_models/delibere";

import * as _ from "lodash";

@Component({
    templateUrl: 'adempimenti-edit.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AdempimentiEditComponent implements OnInit {

    public config: any;
    public model: any = {};
    public error = '';
    public mode: string;
    private loading = false;

    private id: number;

    public fonteSelect2 = [
        { id: 0, text: ' ' },
        { id: 1, text: 'delibera' },
        { id: 2, text: 'M.E.F.' },
        { id: 3, text: 'Corte dei Conti' },
        { id: 4, text: 'Conferenza Stato/Regioni' },
        { id: 5, text: 'Parlamento' },
        { id: 6, text: 'Legge' },
        { id: 9, text: 'altro' }
    ];

    public descrizioneSelect2 = [
        {id: 0, text: ''},
        {id: 1, text: 'Aspetti amministrativi'},
        {id: 2, text: 'Aspetti economico-finanziari'},
        {id: 3, text: 'Aspetti giuridici'},
        {id: 4, text: 'Aspetti giuridici-espropri'},
        {id: 9, text: 'Altro'}
    ];

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

    public datePickerOptions: any;
    public select2Options: Select2Options;
    private select2Debounce: boolean = false;

    public canEdit: boolean = false;
    public canDelete: boolean = false;

    constructor(private router: Router,
                private route: ActivatedRoute,
                public apiService: APICommonService,
                config: AppConfig,
    ) {

        this.config = config.getConfig();

        this.datePickerOptions = config.datePickerOptions;
        this.select2Options = config.select2Options;

        this.cipe$ = this.apiService.subscribeToDataService('cipe');
        this.delibere$ = this.apiService.subscribeToDataService('delibere');

    }

    ngOnInit() {
        this.apiService.refreshCommonCache();

        this.id = +this.route.snapshot.params['id'];
        this.mode = isNaN(this.id) ? 'create' : 'update';
        this.canEdit = isNaN(this.id) ? this.apiService.userCan('CREATE_ADEMPIMENTI') : this.apiService.userCan('EDIT_ADEMPIMENTI');
        this.canDelete = this.apiService.userCan('DELETE_ADEMPIMENTI');

        switch (this.mode) {
            case 'create':
                this.model = {
                    'id_cipe': null,
                    'id_delibere': null,
                    'descrizione': ''
                };
                break;

            case 'update':
                this.apiService.getById('adempimenti', this.id)
                    .subscribe(
                        response => {
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
                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;
        }
    }

    cancel(event) {
        this.router.navigate(['/app/adempimenti/list']);
    }

    submit(event: any, modal: any) {
        this.loading = true;

        console.log(new Adempimenti());

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

        this.model[name] = e.value;
    }

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
