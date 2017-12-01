import {Component, OnInit} from "@angular/core";
import {FormControl} from "@angular/forms";
import {Router} from "@angular/router";

import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/throttleTime";

import * as _ from 'lodash';

import {APICommonService} from "../../_services/index";
import {AppConfig} from "../../app.config";

import {Adempimenti} from "../../_models/adempimenti";
import {Cipe} from "../../_models/cipe";
import {Uffici} from "../../_models/uffici";


@Component({
    templateUrl: 'adempimenti-list.component.html',
})
export class AdempimentiListComponent implements OnInit {

    public filter = {
        id: null,
        descrizione: '',
        numero_delibera: null,
        data_da: null,
        data_a: null,
        id_situazione: null,
        anno_delibera: null,
        data_cipe: null,
        codice_esito: null
    };

    public today = new Date().getTime();
    public firstYear = 1998;
    public currentYear = new Date().getFullYear();
    public years: number[] = [];

    public keysGetter = Object.keys;
    public Math = Math;
    public viewtype: string = 'normal';

    public fonteEnum = {
        0:'',
        1:'delibera',
        2:'M.E.F.',
        3:'Corte dei Conti',
        4:'Conferenza Stato/Regioni',
        5:'Parlamento',
        6:'Legge',
        9:'altro',
    };
    
    public codiceDescrizioneEnum = {
        0: '',
        1: 'Aspetti amministrativi',
        2: 'Aspetti economico-finanziari',
        3: 'Aspetti giuridici',
        4: 'Aspetti giuridici-espropri',
        9: 'Altro'
    };

    public vincoloEnum = {
        0: '',
        1: 'No',
        2: 'Si'
    };
    
    public codiceEsitoEnum = {
        0: { label: '', class: ''},
        1: { label: 'Ottemperato', class: 'bg-ottemperato'},
        2: { label: 'Superato', class: 'bg-superato'},
        3: { label: 'Esaurito', class: 'bg-esaurito'},
        10: { label: 'Attivo', class: 'bg-attivo'},
        11: { label: 'In scadenza', class: 'bg-in_scadenza'},
        12: { label: 'Scaduto', class: 'bg-scaduto'},
        13: { label: 'Parzialmente ottemperato', class: 'bg-parzialmente_ottemperato'}
    };

    public esitoSelect2 = [
        { id: 0, text: ''},
        { id: 1, text: 'Ottemperato' },
        { id: 2, text: 'Superato' },
        { id: 3, text: 'Esaurito' },
        { id: 10, text: 'Attivo' },
        { id: 11, text: 'In scadenza' },
        { id: 12, text: 'Scaduto' },
        { id: 13, text: 'Parzialmente ottemperato' }
    ];


    deletingAdempimenti: Adempimenti = new Adempimenti;

    public adempimenti$: Observable<Adempimenti[]>;
    public adempimenti_ambiti$: Observable<any[]>;
    public adempimenti_azioni$: Observable<any[]>;
    public adempimenti_soggetti$: Observable<any[]>;
    public adempimenti_tipologie$: Observable<any[]>;
    public uffici$: Observable<Uffici[]>;
    public cipe$: Observable<Cipe[]>;


    public filteredCount = {count: 0};

    public select2Options: Select2Options;
    private select2Debounce = false;
    public descrizioneControl = new FormControl();

    public canDelete: boolean = false;

    constructor(public apiService: APICommonService,
                private router: Router,
                private config: AppConfig
    ) {
        this.select2Options = config.select2Options;

        for (let i = this.currentYear; i >= this.firstYear; i--) {
            this.years.push(i);
        }

        this.adempimenti$ = this.apiService.subscribeToDataService('adempimenti').map( adempimenti => this.decorateData(adempimenti) );
        this.adempimenti_ambiti$ = this.apiService.subscribeToDataService('adempimenti_ambiti');
        this.adempimenti_azioni$ = this.apiService.subscribeToDataService('adempimenti_azioni');
        this.adempimenti_soggetti$ = this.apiService.subscribeToDataService('adempimenti_soggetti');
        this.adempimenti_tipologie$ = this.apiService.subscribeToDataService('adempimenti_tipologie');

        this.uffici$ = this.apiService.subscribeToDataService('uffici');
        this.cipe$ = this.apiService.subscribeToDataService('cipe');
    }

    ngOnInit() {
        // debounce keystroke events
        this.descrizioneControl.valueChanges.debounceTime(400).subscribe(newValue => this.filter.descrizione = newValue);
        this.apiService.refreshCommonCache();

        this.canDelete = this.apiService.userCan('DELETE_ADEMPIMENTI');
    }

    decorateData (adempimenti) {

        _.forEach(adempimenti, (adempimento) => {
            adempimento.codice_esito = this.getEsito(adempimento);

            const delibera = _.get( this.apiService.dataEnum, 'delibere["' + adempimento.id_delibere + '"]', '');
            if(delibera) {
                adempimento.data_delibera = delibera.data;
                adempimento.numero_delibera = delibera.numero;
                adempimento.argomento_delibera = delibera.argomento;
            }
        });

        return adempimenti;
    }

    askDeleteAdempimenti(event: any, modal: any, adempimenti: Adempimenti) {
        event.stopPropagation();
        this.deletingAdempimenti = adempimenti;
        modal.open();
    }

    editId(id: number) {
        this.router.navigate(['/app/adempimenti/edit/' + id]);
    }

    editDelibereId(id:number) {
        this.router.navigate(['/app/delibere/edit/' + id]);
    }

    confirmDeleteAdempimenti(modal: any) {
        modal.close();
        this.deleteAdempimenti(this.deletingAdempimenti.id);
        this.deletingAdempimenti = new Adempimenti;
    }

    deleteAdempimenti(id: number) {
        this.apiService.delete('adempimenti', id).subscribe(() => {
            // this.loadAllAdempimenti()
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

        this.filter.data_cipe = null;
        this.filter.anno_delibera = year;

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
        this.filter.anno_delibera = null;

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

    public onFilterChanged(value, type) {
        this.filter[type] = value;
    }

    public resetFilters(event): void {
        event.stopPropagation();
        this.filter = {
            id: null,
            descrizione: '',
            numero_delibera: null,
            data_da: null,
            data_a: null,
            id_situazione: null,
            anno_delibera: null,
            data_cipe: null,
            codice_esito: null
        };
    }

    public countDaysFromToday(date: number): number {
        let days = Math.floor((this.today - date)/86400000);
        return days;
    }

    getEsito(adempimento: Adempimenti): number {
        if(adempimento.codice_esito < 1 && adempimento.data_scadenza) {

            if(this.today > adempimento.data_scadenza) {
                return 12;
            } else if(adempimento.data_scadenza &&  (adempimento.data_scadenza - 15768000000) < this.today ) {
                // 15768000000 = 6 months in milliseconds
                return 11;
            } else {
                return 10;
            }
        } else if (adempimento.codice_esito > 0) {
            return adempimento.codice_esito;
        } else {
            return 10;
        }
    }

    prepareData(): boolean {
        this.adempimenti$

        return true;
    }
}
