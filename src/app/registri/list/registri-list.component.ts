import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';

import { APICommonService } from '../../_services/index';
import { AppConfig } from '../../app.config';

import * as _ from 'lodash';
import {Select2OptionData} from 'ng2-select2';
import { Titolari } from '../../_models/titolari';
import { Registri } from '../../_models/registri';
import { Fascicoli } from '../../_models/fascicoli';
import { Mittenti} from '../../_models/mittenti';



@Component({
    templateUrl: 'registri-list.component.html',
})
export class RegistriListComponent implements OnInit {

    public filter = {
        id: '',
        oggetto: '',
        id_titolari: null,
        id_mittenti: null,
        id_fascicoli: null,
        protocollo_mittente: '',
        protocollo_arrivo: '',
        data_arrivo_da: '',
        data_arrivo_a: ''
    };
    deletingRegistri: Registri = new Registri;

    public titolari$: Observable<Titolari[]>;
    public registri$: Observable<Registri[]>;
    public fascicoli$: Observable<Fascicoli[]>;
    public mittenti$: Observable<Mittenti[]>;

    public filteredCount = {count: 0};

    public select2Options: Select2Options;
    private select2Debounce = false;
    public oggettoControl = new FormControl();



    constructor(public apiService: APICommonService,
                private router: Router,
                private config: AppConfig
    ) {
        this.select2Options = config.select2Options;
        this.titolari$ = this.apiService.subscribeToDataService('titolari');
        this.registri$ = this.apiService.subscribeToDataService('registri');
        this.fascicoli$ = this.apiService.subscribeToDataService('fascicoli');
        this.mittenti$ = this.apiService.subscribeToDataService('mittenti');
    }

    ngOnInit() {
        // debounce keystroke events
        this.oggettoControl.valueChanges.debounceTime(400).subscribe(newValue => this.filter.oggetto = newValue);
        this.apiService.refreshCommonCache();
        // this.loadAllRegistri();
    }

    askDeleteRegistri(event: any, modal: any, registri: Registri) {
        event.stopPropagation();
        this.deletingRegistri = registri;
        modal.open();
    }

    editId(id: number) {
        this.router.navigate(['/app/registri/edit/' + id]);
    }

    confirmDeleteRegistri(modal: any) {
        modal.close();
        this.deleteRegistri(this.deletingRegistri.id);
        this.deletingRegistri = new Registri;
    }

    deleteRegistri(id: number) {
        this.apiService.delete('registri', id).subscribe(() => {
            // this.loadAllRegistri()
            this.apiService.refreshCommonCache();
        });
    }

    public select2Changed(e: any, name: string): void {

        if (this.select2Debounce) {
            this.select2Debounce = false;
            return;
        }

        if (name === 'id_titolari') {
            this.select2Debounce = true;
            this.filter.id_fascicoli = null;
        }

        this.filter[name] = e.value;
    }

    public resetFilters(): void {
        this.filter = {
            id: '',
            oggetto: '',
            id_titolari: null,
            id_mittenti: null,
            id_fascicoli: null,
            protocollo_mittente: '',
            protocollo_arrivo: '',
            data_arrivo_da: '',
            data_arrivo_a: ''
        };
    }
}
