import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {Select2OptionData} from 'ng2-select2';

import {Titolari, Fascicoli, Amministrazione, Mittente} from '../../_models/index';
import {APICommonService} from '../../_services/index';
import {AppConfig} from '../../app.config';


import { AlertService } from '../../_services/index';

@Component({
    templateUrl: 'fascicoli-edit.component.html'
})

export class FascicoliCreateComponent implements OnInit, OnDestroy {
    model: any = {};
    error: string = '';
    loading: boolean = false;
    mode: string;
    selected: any;

    public select2Options: Select2Options;
    public select2OptionsMulti: Select2Options;

    constructor(
        private router: Router,
        private apiService: APICommonService,
        config: AppConfig
    ) {
        this.select2Options = config.select2Options;
        this.select2OptionsMulti = Object.assign({}, config.select2Options);
        this.select2OptionsMulti['multiple'] = true;
    }

    ngOnInit() {

    }

    ngOnDestroy(): void {
    }

    submit() {
        this.loading = true;

        switch( this.mode ) {
            case 'create':
                this.apiService.create('fascicoli', this.model)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/fascicoli/list']);
                        },
                        error => {
                            this.error = error;
                            this.loading = false;
                        });
                break;

            case 'update':
                this.apiService.update('fascicoli', this.model)
                    .subscribe(
                        data => {
                        },
                        error => {
                            this.error = error;
                            this.loading = false;
                        });
                break;
        }
    }

    select2Changed(e: any): void {
        this.selected = e.value;
    }

}
