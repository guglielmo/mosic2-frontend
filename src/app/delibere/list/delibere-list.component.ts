import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';

import { APICommonService } from '../../_services/index';
import { AppConfig } from '../../app.config';

import { Delibere } from '../../_models/delibere';
import { Cipe } from '../../_models/cipe';
import { Uffici } from '../../_models/uffici';
import { Tags } from '../../_models/tags';

@Component({
    templateUrl: 'delibere-list.component.html',
})
export class DelibereListComponent implements OnInit {

    public today = new Date().getTime();
    public firstYear = 1998;
    public currentYear: any;
    public years: number[] = [];

    public filter = {
        id: null,
        argomento: '',
        numero: null,
        data_da: null,
        data_a: null,
        id_situazione: '',
        anno: null,
        data_cipe: null,
        id_tags: ''
    };

    private dateFilter: any;

    public keysGetter = Object.keys;
    public viewtype: string = 'list';
    
    public situazione = [
        {id: 1, text: 'Da acquisire'},
        {id: 2, text: 'In lavorazione' },
        {id: 3, text: 'Al M.E.F.'},
        {id: 4, text: 'Tornata dal M.E.F.'},
        {id: 5, text: 'In firma Segretario Cipe'},
        {id: 6, text: 'In firma Presidente Cipe'},
        {id: 7, text: 'Alla Corte dei Conti'},
        {id: 8, text: 'Alla Gazzetta Ufficiale'},
        {id: 9, text: 'Pubblicata in Gazzetta Ufficiale'}
    ];

    public situazioneEnum = {
        1: 'Da acquisire',
        2: 'In lavorazione',
        3: 'Al M.E.F.',
        4: 'Tornata dal M.E.F.',
        5: 'In firma Segretario Cipe',
        6: 'In firma Presidente Cipe',
        7: 'Alla Corte dei Conti',
        8: 'Alla Gazzetta Ufficiale',
        9: 'Pubblicata in Gazzetta Ufficiale'
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
    public tags$: Observable<Tags[]>;


    public filteredCount = {count: 0};

    public select2Options: Select2Options;
    public argomentoControl = new FormControl();

    constructor(public apiService: APICommonService,
                private router: Router,
                private route: ActivatedRoute,
                private config: AppConfig
    ) {
        this.select2Options = config.select2Options;

        // init current year and years list
        const d =  new Date();
        this.currentYear = d.getFullYear();
        for (let i = this.currentYear; i >= this.firstYear; i--) {
            this.years.push(i);
        }

        this.delibere$ = this.apiService.subscribeToDataService('delibere');
        this.uffici$ = this.apiService.subscribeToDataService('uffici');
        this.cipe$ = this.apiService.subscribeToDataService('cipe');
        this.tags$ = this.apiService.subscribeToDataService('tags');

        this.router.events
            .subscribe((event) => {
                if (event instanceof NavigationEnd &&
                    event.url.indexOf('delibere') != -1 &&
                    event.url.indexOf('edit') === -1) {

                    this.viewtype = this.route.snapshot.params['viewtype'];
                    this.dateFilter = this.route.snapshot.params['dateFilter'];

                    if (this.dateFilter && this.dateFilter.length === 4) {

                        this.filter.anno = Number(this.dateFilter);
                        this.onYearChanged(this.dateFilter);

                    } else if (this.dateFilter && this.dateFilter.length === 10) {

                        let year = new Date(this.dateFilter).getFullYear();
                        this.filter.anno = year;
                        this.filter.data_cipe = this.dateFilter;
                        this.onDataCipeChanged(this.dateFilter)

                    } else {

                        this.onYearChanged(this.currentYear);
                    }
                }
            });
    }

    ngOnInit() {
        // debounce keystroke events
        this.argomentoControl.valueChanges.debounceTime(400).subscribe(newValue => this.filter.argomento = newValue);
        this.apiService.refreshCommonCache();
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

        this.filter[name] = e.value;
    }

    public onYearChanged(year) {

        this.filter.anno = year;
        this.dateFilter = year;
        this.filter.data_cipe = '';

        if(year !== '') {
            let data_da = new Date();
            data_da.setFullYear(year,0,1);
            data_da.setHours(0,0,0,0);

            let data_a = new Date();
            data_a.setFullYear(year,11,31);
            data_a.setHours(0,0,0,0);

            this.filter.data_da = data_da;
            this.filter.data_a = data_a;
        } else {
            this.filter.data_da = null;
            this.filter.data_a = null;
        }

        if (this.dateFilter) {
            this.router.navigate(['/app/delibere/' + this.viewtype + '/' + this.dateFilter]);
        }
    }

    public onDataCipeChanged(date) {

        this.filter.anno = '';
        this.dateFilter = date;
        this.filter.data_cipe = date;

        if(date !== '') {
            let data_da = new Date(date);
            data_da.setHours(0,0,0,0);
            let data_a = new Date(date);
            data_a.setHours(0,0,0,0);

            this.filter.data_da = data_da;
            this.filter.data_a = data_a;
        } else {
            this.filter.data_da = null;
            this.filter.data_a = null;
        }

        if (this.dateFilter) {
            this.router.navigate(['/app/delibere/' + this.viewtype + '/' + this.dateFilter]);
        }
    }

    public onViewTypeChange(type) {
        if (this.dateFilter) {
            this.router.navigate(['/app/delibere/'+this.viewtype+'/'+this.dateFilter]);

        } else {

            this.router.navigate(['/app/delibere/'+this.viewtype]);
        }
    }

    public resetFilters(event): void {
        event.stopPropagation();
        this.filter = {
            id: null,
            argomento: '',
            numero: null,
            data_da: null,
            data_a: null,
            id_situazione: '',
            anno: null,
            data_cipe: null,
            id_tags: ''
        };
    }

    public countDaysFromToday(date: number): number {
        let days = Math.floor((this.today - date)/86400000);
        return days;
    }

    public limitRange(val) {
        return Math.min(Math.max(val*2,14),500);
    }
}
