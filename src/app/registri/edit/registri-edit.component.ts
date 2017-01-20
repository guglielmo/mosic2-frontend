import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//import {__platform_browser_private__} from '@angular/platform-browser'; // needed for select2 styles override hack

import {Titolari, Fascicoli, Amministrazione, Mittente} from '../../_models/index';
import {APICommonService} from '../../_services/index';
import {AppConfig} from '../../app.config';


@Component({
    templateUrl: 'registri-edit.component.html',
    encapsulation: ViewEncapsulation.None
})
export class RegistriEditComponent implements OnInit {

    model: any = {};
    error: string = '';
    mode: string;
    loading: boolean = false;
    id: number;
    selected: any;

    titolari: Titolari[] = [];
    fascicoli: Fascicoli[] = [];
    amministrazione: Amministrazione[] = [];
    mittente: Mittente[] = [];

    date: Date = new Date(2016, 5, 10);
    query: any;

    public select2Options: Select2Options;
    public select2OptionsMulti: Select2Options;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private apiService: APICommonService,
                private config: AppConfig
    ) {

        this.select2Options = config.select2Options;
        this.select2OptionsMulti = Object.assign({}, config.select2Options);
        this.select2OptionsMulti['multiple'] = true;
    }

    ngOnInit() {

        this.id = +this.route.snapshot.params['id'];
        this.mode = isNaN(this.id) ? 'create' : 'update';

        switch (this.mode) {
            case 'create':
                break;

            case 'update':
                this.apiService.getById('registri', this.id)
                    .subscribe(
                        response => {
                            this.model = response.data;
                            this.model.data_arrivo = new Date(this.model.data_arrivo);
                            this.model.data_mittente = new Date(this.model.data_mittente);
                        },
                        error => {
                            this.error = error;
                            this.loading = false;
                        });
                break;
        }

    }

    cancel( event ) {
        this.router.navigate(['/app/registri/list']);
    }

    submit() {
        this.loading = true;

        switch (this.mode) {
            case 'create':
                this.apiService.create('registri', this.model)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/registri/list']);
                        },
                        error => {
                            this.error = error;
                            this.loading = false;
                        });
                break;

            case 'update':
                this.apiService.update('registri', this.model)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/registri/list']);
                        },
                        error => {
                            this.error = error;
                            this.loading = false;
                        });
                break;
        }
    }

    select2Changed(e: any, name: string): void {
        this.model[name] = e.value;

/*        console.log(name, e.value);
        if(parseInt(e.value)) {
            this.model[name] = Number(e.value);
        } else {
            this.model[name] = e.value;
        }*/
    }

    onUploadSuccess(e: any): void {
        console.log(e);
    }

    onUploadError(e: any): void {

    }

}
