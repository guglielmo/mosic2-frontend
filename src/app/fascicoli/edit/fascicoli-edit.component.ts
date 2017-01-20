import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Select2OptionData} from 'ng2-select2';

import {Fascicoli} from '../../_models/index';
import {APICommonService} from '../../_services/index';
import {AppConfig} from '../../app.config';

@Component({
    templateUrl: 'fascicoli-edit.component.html'
})

export class FascicoliEditComponent implements OnInit {
    model: any = {};
    error: string = '';
    mode: string;
    loading: boolean = false;
    id: number;
    selected: any;

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
                this.apiService.getById('fascicoli', this.id)
                    .subscribe(
                        response => {
                            this.model = response.data;
                            this.model.data_magazzino = new Date(this.model.data_magazzino);
                        },
                        error => {
                            this.error = error;
                            this.loading = false;
                        });
                break;
        }

    }

    cancel(event) {
        this.router.navigate(['/app/fascicoli/list']);
    }

    submit() {
        this.loading = true;

        //todo: su fascicolo al salvataggio mancano gli id dei dati relazionali (tendine)

        console.log(this.model);

        switch (this.mode) {
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
                            this.router.navigate(['/app/fascicoli/list']);
                        },
                        error => {
                            this.error = error;
                            this.loading = false;
                        });
                break;
        }
    }

    public select2Changed(e: any, name: string): void {
        this.model[name] = e.value;
    }

}
