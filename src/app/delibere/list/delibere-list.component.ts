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
import { Delibere } from '../../_models/delibere';
import { Cipe } from '../../_models/index';
import { Uffici } from '../../_models/uffici';




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
        id_situazione: null,
        anno: null,
        data_cipe: null
    };

    public today = new Date().getTime();
    public firstYear = 1998;
    public currentYear = new Date().getFullYear();
    public years: number[] = [];

    public keysGetter = Object.keys;
    public Math = Math;
    public viewtype: string = 'normal';
    
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

    public osservazioneEnum = {
        1: 'Rilievo',
        2: 'Restituzione',
        3: 'A Vuoto'
    };

    deletingDelibere: Delibere = new Delibere;

    public delibere$: Observable<Delibere[]>;
    public uffici$: Observable<Uffici[]>;
    public cipe$: Observable<Cipe[]>;


    public filteredCount = {count: 0};

    public select2Options: Select2Options;
    private select2Debounce = false;
    public argomentoControl = new FormControl();

    constructor(public apiService: APICommonService,
                private router: Router,
                private config: AppConfig
    ) {
        this.select2Options = config.select2Options;

        for (let i = this.currentYear; i >= this.firstYear; i--) {
            this.years.push(i);
        }

        this.delibere$ = this.apiService.subscribeToDataService('delibere');
        this.uffici$ = this.apiService.subscribeToDataService('uffici');
        this.cipe$ = this.apiService.subscribeToDataService('cipe');
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

    public onYearChanged(year) {

        this.filter.anno = year;

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

    public resetFilters(): void {
        this.filter = {
            id: null,
            argomento: '',
            numero: null,
            data_da: null,
            data_a: null,
            id_situazione: null,
            anno: null,
            data_cipe: null
        };
    }

    public countDaysFromToday(date: number): number {
        let days = Math.floor((this.today - date)/86400000);
        return days;
    }
}
