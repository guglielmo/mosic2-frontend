import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {Select2OptionData} from 'ng2-select2';

import {Titolari, Fascicoli, Amministrazione, Mittente} from '../_models/index';

import {AppConfig} from '../app.config';

@Injectable()
export class APICommonService {
    public config: any;

    public titolari: Titolari[] = [];
    public titolariSelect: Select2OptionData[] = [];
    public titolariEnum: any = {};

    public fascicoli: Fascicoli[];
    public fascicoliSelect: Select2OptionData[] = [];

    public amministrazione: Amministrazione[] = [];
    public amministrazioneSelect: Select2OptionData[] = [];
    public amministrazioneEnum: any = {};

    public mittente: Mittente[] = [];
    public mittenteSelect: Select2OptionData[] = [];

    private commonDataLoadCount: number = 0;
    public commonDataready: boolean = false;

    constructor(private http: Http, config: AppConfig) {
        this.config = config.getConfig();
    }

    ngOnInit() {

    }

    // PUBLIC helper methods
    getAll(apipath: string) {
        return this.http.get(this.config.baseAPIURL + '/api/' + apipath, this.jwt()).map((response: Response) => response.json());
    }

    getById(apipath: string, id: number) {
        return this.http.get(this.config.baseAPIURL + '/api/' + apipath + '/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(apipath: string, data: any) {
        return this.http.post(this.config.baseAPIURL + '/api/' + apipath, data, this.jwt()).map((response: Response) => response.json());
    }

    update(apipath: string, data: any) {
        return this.http.put(this.config.baseAPIURL + '/api/' + apipath + '/' + data.id, data, this.jwt()).map((response: Response) => response.json());
    }

    delete(apipath: string, id: number) {
        return this.http.delete(this.config.baseAPIURL + '/api/' + apipath + '/' + id, this.jwt()).map((response: Response) => response.json());
    }

    public cacheData() {

        // TITOLARI
        this.getAll('titolari').subscribe(response => {

            let titolari = response.data;

            this.titolari = titolari;
            this.titolariSelect = $.extend(true, [], titolari) as Select2OptionData[];
            this.titolariSelect.forEach((entry) => {
                entry.text = entry['codice'] + ' - ' + entry['denominazione'] + ' - ' + entry['descrizione'];
                entry['id'] = entry['id'];

                this.titolariEnum[entry['id']] = entry['denominazione'];
            });
            this.titolariSelect.unshift({id: '-1', text: 'Inizia a scrivere per selezionare...'});

            this.commonDataready = (++this.commonDataLoadCount >= 4);
        });

        // FASCICOLI
        this.getAll('fascicoli').subscribe(response => {

            let fascicoli = response.data;

            fascicoli.forEach((entry) => {
                entry['titolario'] = this.titolariEnum[entry['titolario']];
            });
            this.fascicoli = fascicoli;
            this.fascicoliSelect = $.extend(true, [], fascicoli) as Select2OptionData[];
            this.fascicoliSelect.forEach((entry) => {
                entry['text'] = entry['numero_fascicolo'] + ' - ' + entry['argomento'];
            });
            this.fascicoliSelect.unshift({id: '-1', text: 'Inizia a scrivere per selezionare...'});

            this.commonDataready = (++this.commonDataLoadCount >= 4);
        });

        // AMMINISTRAZIONE
        this.getAll('amministrazione').subscribe(response => {

            let amministrazione = response.data;

            this.amministrazione = amministrazione;
            this.amministrazioneSelect = $.extend(true, [], amministrazione) as Select2OptionData[];
            this.amministrazioneSelect.forEach((entry) => {
                entry['text'] = entry['codice'] + ' - ' + entry['denominazione'];

                this.amministrazioneEnum[entry['id']] = entry['denominazione'];
            });
            this.amministrazioneSelect.unshift({id: '-1', text: 'Inizia a scrivere per selezionare...'});

            this.commonDataready = (++this.commonDataLoadCount >= 4);
        });

        // MITTENTE
        this.getAll('mittente').subscribe(response => {

            let mittente = response.data;

            this.mittente = mittente;
            this.mittenteSelect = $.extend(true, [], mittente) as Select2OptionData[];
            this.mittenteSelect.forEach((entry) => {
                entry['text'] = entry['codice'] + ' - ' + entry['denominazione'];
            });
            this.mittenteSelect.unshift({id: '-1', text: 'Inizia a scrivere per selezionare...'});

            this.commonDataready = (++this.commonDataLoadCount >= 4);
        });
    }

    public cacheCommon(apipath: string) {

        this.getAll(apipath).subscribe(data => {

            this[apipath] = data;
            this[apipath+'Select'] = $.extend(true, [], data) as Select2OptionData[];
            this[apipath+'Enum'] = {};

            switch (apipath) {
                case 'titolari':
                    this.titolariSelect.forEach((entry) => {
                        entry.text = entry['codice'] + ' - ' + entry['denominazione'] + ' - ' + entry['descrizione'];
                        this.titolariEnum[entry['id']] = entry['denominazione'];
                    });
                    break;

                case 'fascicoli':
                    this.fascicoli.forEach((entry) => {
                        entry['titolario'] = this.titolariEnum[entry['titolario']];
                    });
                    this.fascicoliSelect.forEach((entry) => {
                        entry['text'] = entry['numero_fascicolo'] + ' - ' + entry['argomento'];
                    });
                    break;

                case 'amministrazione':
                    this.amministrazioneSelect.forEach((entry) => {
                        entry['text'] = entry['codice'] + ' - ' + entry['denominazione'];
                        this.amministrazioneEnum[entry['id']] = entry['denominazione'];
                    });
                    break;

                case 'mittente':
                    this.mittenteSelect.forEach((entry) => {
                        entry['text'] = entry['codice'] + ' - ' + entry['denominazione'];
                    });
                    break;
            }

            this[apipath+'Select'].unshift({id: '-1', text: 'Inizia a scrivere per selezionare...'});

            this.commonDataready = (
                this.titolari.length > 0 && this.fascicoli.length > 0 && this.amministrazione.length > 0 && this.mittente.length > 0
            );


        });
    }

    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({'Authorization': 'Bearer ' + currentUser.token});
            return new RequestOptions({headers: headers});
        }
    }
}