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
import { Delibere, Uffici } from '../../_models/index';




@Component({
    templateUrl: 'delibere-list.component.html',
})
export class DelibereListComponent implements OnInit {

    public filter = {
        id: null,
        argomento: '',
        numero: null,
        data_da: null,
        data_a: null,
        id_situazione: null
    };
    
    public situazione = [
        {id: 1, text: 'Da acquisire'},
        {id: 2, text: 'In lavorazione' },
        {id: 3, text: 'Al M.E.F.'},
        {id: 4, text: 'Tornata dal M.E.F.'},
        {id: 5, text: 'In firma Segretario Cipe'},
        {id: 6, text: 'In firma Presidente Cipe'},
        {id: 7, text: 'Alla Corte dei Conti'},
        {id: 8, text: 'Alla Gazzetta Ufficiale'}
    ];

    public situazioneEnum = {
        1: 'Da acquisire',
        2: 'In lavorazione',
        3: 'Al M.E.F.',
        4: 'Tornata dal M.E.F.',
        5: 'In firma Segretario Cipe',
        6: 'In firma Presidente Cipe',
        7: 'Alla Corte dei Conti',
        8: 'Alla Gazzetta Ufficiale'        
    };

    deletingDelibere: Delibere = new Delibere;

    public delibere$: Observable<Delibere[]>;
    public uffici$: Observable<Uffici[]>;


    public filteredCount = {count: 0};

    public select2Options: Select2Options;
    private select2Debounce = false;
    public argomentoControl = new FormControl();



    constructor(public apiService: APICommonService,
                private router: Router,
                private config: AppConfig
    ) {
        this.select2Options = config.select2Options;
        this.delibere$ = this.apiService.subscribeToDataService('delibere');
        this.uffici$ = this.apiService.subscribeToDataService('uffici');
    }

    ngOnInit() {
        // debounce keystroke events
        this.argomentoControl.valueChanges.debounceTime(400).subscribe(newValue => this.filter.argomento = newValue);
        this.apiService.refreshCommonCache();
        // this.loadAllDelibere();
    }

    askDeleteDelibere(event: any, modal: any, delibere: Delibere) {
        event.stopPropagation();
        this.deletingDelibere = delibere;
        modal.open();
    }

    editId(id: number) {
        this.router.navigate(['/app/delibere/edit/' + id]);
    }

    confirmDeleteDelibere(modal: any) {
        modal.close();
        this.deleteDelibere(this.deletingDelibere.id);
        this.deletingDelibere = new Delibere;
    }

    deleteDelibere(id: number) {
        this.apiService.delete('delibere', id).subscribe(() => {
            // this.loadAllDelibere()
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

    public resetFilters(): void {
        this.filter = {
            id: null,
            argomento: '',
            numero: null,
            data_da: null,
            data_a: null,
            id_situazione: null
        };
    }
}
