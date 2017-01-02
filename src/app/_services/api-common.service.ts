import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Select2OptionData } from 'ng2-select2';

import {Titolari, Fascicoli, Amministrazione, Mittente} from '../_models/index';

import {AppConfig} from '../app.config';

@Injectable()
export class APICommonService {
    config: any;

    titolari: Titolari[] = [];
    titolariSelect: Select2OptionData[] = [];
    titolariEnum: any = {};

    fascicoli: Fascicoli[];
    fascicoliSelect: Select2OptionData[] = [];

    amministrazione: Amministrazione[] = [];
    amministrazioneSelect: Select2OptionData[] = [];

    mittente: Mittente[] = [];
    mittenteSelect: Select2OptionData[] = [];

    constructor(private http: Http, config: AppConfig) {
        this.config = config.getConfig();
        this.cacheData();
    }

    ngOnInit() {

    }

    getAll(apipath: string) {
        return this.http.get( this.config.baseAPIURL + '/api/'+apipath, this.jwt()).map((response: Response) => response.json());
    }

    getById(apipath: string, id: number) {
        return this.http.get( this.config.baseAPIURL + '/api/'+apipath+'/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(apipath: string, data: any) {
        return this.http.post( this.config.baseAPIURL + '/api/'+apipath, data, this.jwt()).map((response: Response) => response.json());
    }

    update(apipath: string, data: any) {
        return this.http.put( this.config.baseAPIURL + '/api/'+apipath+'/' + data.id, data, this.jwt()).map((response: Response) => response.json());
    }

    delete(apipath: string, id: number) {
        return this.http.delete( this.config.baseAPIURL + '/api/'+apipath+'/' + id, this.jwt()).map((response: Response) => response.json());
    }

    // PUBLIC helper methods

    public cacheData() {
        this.getAll('titolari').subscribe(titolari => {
            this.titolari = titolari;
            this.titolariSelect = Object.assign([], titolari) as Select2OptionData[];
            this.titolariSelect.forEach((entry) => {
                entry.text = entry['codice'] + ' - ' + entry['denominazione'] + ' - ' + entry['descrizione'];
                entry['id'] = entry['id'];

                this.titolariEnum[entry['id']] = entry['denominazione'];
            });
            this.titolariSelect.unshift({id: '-1', text: 'Inizia a scrivere per selezionare...'});
        });

        this.getAll('fascicoli').subscribe(fascicoli => {
            fascicoli.forEach((entry) => {
                entry['titolario'] = this.titolariEnum[entry['titolario']];
            });
            this.fascicoli = fascicoli;
            this.fascicoliSelect = Object.assign([], fascicoli) as Select2OptionData[];
            this.fascicoliSelect.forEach((entry) => {
                entry['text'] = entry['numero_fascicolo'] + ' - ' + entry['argomento'];
                entry['id'] = entry['numero_fascicolo'];
            });
            this.fascicoliSelect.unshift({id: '-1', text: 'Inizia a scrivere per selezionare...'});
        });

        this.getAll('amministrazione').subscribe(amministrazione => {
            this.amministrazione = amministrazione;
            this.amministrazioneSelect = Object.assign([], amministrazione) as Select2OptionData[];
            this.amministrazioneSelect.forEach((entry) => {
                entry['text'] = entry['codice'] + ' - ' + entry['denominazione'];
                entry['id'] = entry['id'];
            });
            this.amministrazioneSelect.unshift({id: '-1', text: 'Inizia a scrivere per selezionare...'});
        });

        this.getAll('mittente').subscribe(mittente => {
            this.mittente = mittente;
            this.mittenteSelect = Object.assign([], mittente) as Select2OptionData[];
            this.mittenteSelect.forEach((entry) => {
                entry['text'] = entry['codice'] + ' - ' + entry['denominazione'];
                entry['id'] = entry['id'];
            });
            this.mittenteSelect.unshift({id: '-1', text: 'Inizia a scrivere per selezionare...'});
        });
    }

    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }
}