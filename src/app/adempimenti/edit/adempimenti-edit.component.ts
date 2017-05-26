import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { APICommonService } from "../../_services/index";
import { AppConfig } from "../../app.config";


import { Adempimenti } from "../../_models/adempimenti"
import { Cipe } from "../../_models/cipe"
import { Delibere } from "../../_models/delibere"


import * as _ from "lodash";

@Component({
    templateUrl: 'adempimenti-edit.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AdempimentiEditComponent implements OnInit {

    private config: any;
    public model: any = {};
    public error = '';
    public mode: string;
    private loading = false;

    private id: number;

    private routeFragmentSubscription: any;

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

    public cipe$: Observable<Cipe[]>;
    public delibere$: Observable<Delibere[]>;

    public datePickerOptions: any;
    public select2Options: Select2Options;

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
                    'id_cipe': '',
                    'id_delibere': '',
                };
                break;

            case 'update':
                this.apiService.getById('adempimenti', this.id)
                    .subscribe(
                        response => {

                            console.log(response.data);

                            if(Array.isArray(response.data)) {
                                this.model = response.data[0];
                            } else {
                                this.model = response.data;
                            }

                            this.model.id_cipe = '';


                            // instantiate every date
                            let tz = new Date().getTimezoneOffset();
                            _.forEach(this.model, (value, key) => {
                                if(key && key.indexOf('data') !== -1) {
                                    if(value) {
                                        this.model[key] = new Date(value + tz*60000);
                                    }
                                }
                            });

                            if(!this.model.data_mef_pec && this.model.data_mef_invio) {
                                this.model.data_mef_pec = this.model.data_mef_invio;
                            }

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
        let tz = new Date().getTimezoneOffset();


        // convert every date to milliseconds
        _.forEach(post, (value, key) => {
            if(key && key.indexOf('data') !== -1) {
                console.log(key, typeof value, value);
                if(value) {
                    post[key] = new Date(value.getTime() - tz*60000);
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

    public select2Changed(e: any, name: string): void {

        this.model[name] = e.value;
    }

    public onDataCipeChanged(date) {


    }

    private jwt() {
        // get jwt token
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            return currentUser.token;
        }
    }

}
