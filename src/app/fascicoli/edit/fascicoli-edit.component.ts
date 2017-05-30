import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { APICommonService } from '../../_services/index';
import { AppConfig } from '../../app.config';
import * as _ from 'lodash';

import { Registri } from '../../_models/registri';
import { Titolari } from '../../_models/titolari';
import { Amministrazioni } from '../../_models/amministrazioni';
import { Tags } from '../../_models/tags';

@Component({
    templateUrl: 'fascicoli-edit.component.html'
})

export class FascicoliEditComponent implements OnInit {
    model: any = {};
    error = '';
    mode: string;
    loading = false;
    id: number;
    selected: any;

    public filteredCount = {count: 0};

    public select2Options: Select2Options;
    public select2WithAddOptions: Select2Options;
    public select2OptionsMulti: Select2Options;
    public select2WithAddOptionsMulti: Select2Options;

    public titolari$: Observable<Titolari[]>;
    public amministrazioni$: Observable<Amministrazioni[]>;
    public registri$: Observable<Registri[]>;
    public tags$: Observable<Tags[]>;

    public canEdit: boolean = false;

    constructor(private router: Router,
                private route: ActivatedRoute,
                public apiService: APICommonService,
                private config: AppConfig) {

        this.select2Options = config.select2Options;
        this.select2WithAddOptions = config.select2WithAddOptions;
        this.select2OptionsMulti = config.select2OptionsMulti;
        this.select2WithAddOptionsMulti = config.select2WithAddOptionsMulti;

        this.titolari$ = this.apiService.subscribeToDataService('titolari');
        this.amministrazioni$ = this.apiService.subscribeToDataService('amministrazioni');
        this.registri$ = this.apiService.subscribeToDataService('registri');
        this.tags$ = this.apiService.subscribeToDataService('tags');
    }

    ngOnInit() {
        this.apiService.refreshCommonCache();

        this.id = +this.route.snapshot.params['id'];
        this.mode = isNaN(this.id) ? 'create' : 'update';
        this.canEdit = isNaN(this.id) ? this.apiService.userCan('CREATE_FASCICOLI') : this.apiService.userCan('EDIT_FASCICOLI');

        switch (this.mode) {
            case 'create':
                this.model = {
                };
                break;

            case 'update':
                this.apiService.getById('fascicoli', this.id)
                    .subscribe(
                        response => {
                            let tz = new Date().getTimezoneOffset();
                            this.model = response.data;
                            this.model.data_magazzino = new Date(this.model.data_magazzino + tz*60000);
                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;
        }

    }

    cancel(event) {
        this.router.navigate(['/app/fascicoli/list']);
    }

    submit(event: any, modal: any) {
        this.loading = true;

        let post = $.extend(true, {}, this.model);
        let tz = new Date().getTimezoneOffset();
        post.data_magazzino = new Date(post.data_magazzino - tz*60000);

        switch (this.mode) {
            case 'create':
                this.apiService.create('fascicoli', post)
                    .subscribe(
                        data => {
                            console.log(data);
                            this.model = data;
                            modal.open();
                            // this.router.navigate(['/app/fascicoli/list']);
                        },
                        error => {
                            modal.open();
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;

            case 'update':
                this.apiService.update('fascicoli', post)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/fascicoli/list']);
                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;
        }
    }

    select2Changed(e: any, name: string): void {

        // console.log(name, typeof e.value, e.value);

        // converts value to arrays to handle multi-selects and selects in the same way
        const V = typeof e.value === 'string' ? e.value.split(',') : e.value;

        const selectedCount = this.model[name] ? this.model[name].split(',').length : 0;

        if (V.length > selectedCount) {
            // Value added
            console.log('value added');
            this.mayBeCreateNewSelect2Values(name);

        } else if (V.length < selectedCount) {
            // Value removed
            // console.log('value removed');

        } else if (V.join(',') !== this.model[name]) {
            // console.log('value changed');
            this.mayBeCreateNewSelect2Values(name);
        }

        // go back to comma separated strings in the model value as the server handles
        // both single and multi selects as strings
        this.model[name] = typeof e.value === 'object' && e.value != null ? e.value.join(',') : e.value;

    }

    mayBeCreateNewSelect2Values(name) {

        // console.log('trying to add new ' + name, '#' + name + ' select option[data-select2-tag="true"]');

        const newValues = $('#' + name + ' select option[data-select2-tag="true"]');

        // console.log(newValues.length);

        if (newValues.length) {

            const apipath = name.split('_')[1];

            newValues.each((index: number, elem: HTMLInputElement) => {

                // console.log(name, newValues, elem);

                this.apiService.create(apipath, { 'denominazione': elem.value } )
                    .subscribe(
                        response => {
                            const id = response.data.id,
                                 den = response.data.denominazione;

                            const label = id + ' - ' + den;
                            response.data.text = label;

                            // creates the new entry on the relative apiService select2 data
                            // this.apiService[apipath+'Select'].push(response.data);

                            // find the select element and update temporary id with the new assigned id
                            $('#' + name + ' select option[value="' + den + '"]').val(id).text(label);

                            // replace the temporary id in the model with the new assigned id
                            const selectedValues = this.model[name].split(',');

                            const i = _.indexOf(selectedValues, _.find(selectedValues, den));
                            selectedValues.splice(i, 1, id);

                            this.model[name] = selectedValues.join(',');

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

    public confirmCodeNotification(modal: any) {
        modal.close();
        this.router.navigate(['/app/fascicoli/edit/' + this.model.id]);
    }

    public editRegistriId(id: number) {
        this.router.navigate(['/app/registri/edit/' + id]);
    }

}
