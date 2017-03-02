import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Select2OptionData } from 'ng2-select2';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch'


import { Titolari, Fascicoli, Registri, Amministrazioni, Mittenti } from '../_models/index';

import {AppConfig} from '../app.config';


@Injectable()
export class APICommonService {
    public config: any;
    public configFn: any;

    public titolari: Titolari[] = [];
    public titolariSelect: Select2OptionData[] = [];
    public titolariEnum: any = {};
    public titolariIdCodEnum: any = {};

    public fascicoli: Fascicoli[] = [];
    public fascicoliSelect: Select2OptionData[] = [];

    public registri: Registri[] = [];
    public registriSelect: Select2OptionData[] = [];

    public amministrazioni: Amministrazioni[] = [];
    public amministrazioniSelect: Select2OptionData[] = [];
    public _amministrazioniEnum: any = {};

    public mittenti: Mittenti[] = [];
    public mittentiSelect: Select2OptionData[] = [];
    public mittentiEnum: any = {};

    public commonDataready: boolean = false;
    public isDirty: boolean = false;

    private cachedApiDataMetods: string[] = [
        'amministrazioni',
        'mittenti',
        'titolari',
        'fascicoli',
        'registri'
    ];

    private storedLastUpdates: any = {};

    constructor( private http: Http,
                 config: AppConfig
    ) {
        this.config = config.getConfig();
        this.configFn = config;
    }

    ngOnInit() {
    }

    // PUBLIC helper methods
    public getAll(apipath: string, params?:URLSearchParams) {
        let query = params ? '?'+params.toString() : '';
        return this.http.get(this.config.baseAPIURL + '/api/' + apipath + query, this.jwt())
                        .map((response: Response) => response.json())
                        .catch((response: Response) => this.handleError(response));
    }

    public getById(apipath: string, id: number) {
        return this.http.get(this.config.baseAPIURL + '/api/' + apipath + '/' + id, this.jwt())
                        .map((response: Response) => response.json())
                        .catch((response: Response) => this.handleError(response));
    }

    public create(apipath: string, data: any) {
        this.setDirty(apipath);
        return this.http.post(this.config.baseAPIURL + '/api/' + apipath, data, this.jwt())
                        .map((response: Response) => response.json())
                        .catch((response: Response) => this.handleError(response));
    }

    public update(apipath: string, data: any) {
        this.setDirty(apipath);
        return this.http.put(this.config.baseAPIURL + '/api/' + apipath + '/' + data.id, data, this.jwt())
                        .map((response: Response) => response.json())
                        .catch((response: Response) => this.handleError(response));
    }

    public delete(apipath: string, id: number) {
        this.setDirty(apipath);
        return this.http.delete(this.config.baseAPIURL + '/api/' + apipath + '/' + id, this.jwt())
                        .map((response: Response) => response.json())
                        .catch((response: Response) => this.handleError(response));
    }

    public getLastUpdates() {
        return this.http.get(this.config.baseAPIURL + '/api/lastupdates', this.jwt())
                        .map((response: Response) => response.json())
                        .catch((response: Response) => this.handleError(response));
    }

    private handleError (error: Response | any) {

        let errMsg: string;
        if (error instanceof Response) {

            let body = error.json() || '';
            let err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err.message}`;

            let usermsg = err.message ? err.message : 'Errore non previsto, consultare la console per ulteriori informazioni';
            this.configFn.notify(usermsg);

        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error('>>>>',errMsg);

        return Observable.throw(errMsg);
    }

    public refreshCommonCache() {

        this.getLastUpdates().subscribe(response => {

            // retrieve new and last stored updates
            let storedLastUpdates = JSON.parse(localStorage.getItem('lastupdates')) || {};
            let lastupdates = response.data;

            // for every cached API method
            for (let i=0; i<this.cachedApiDataMetods.length; i++) {
                let apipath = this.cachedApiDataMetods[i];

                // if not stored or fresher on the backend
                if(!storedLastUpdates[apipath] || lastupdates[apipath] > storedLastUpdates[apipath]) {

                    // initiate a cache priming
                    this.cacheCommon(apipath, lastupdates[apipath]);

                } else {
                // get it from local storage
                    this[apipath] = JSON.parse(localStorage.getItem('stored_'+apipath)) || [];
                    this.prepareSelects(apipath);
                }
            }
            this.commonDataready = ( this.titolari.length > 0 && this.fascicoli.length > 0 && this.amministrazioni.length > 0 && this.mittenti.length > 0 );
        });

    }

    private setDirty(apipath: string) {

        if(this.cachedApiDataMetods.indexOf(apipath) != -1) {

            // retrive and set last update to zero for the method
            let storedUpdates = JSON.parse(localStorage.getItem('lastupdates')) || {};
            storedUpdates[apipath] = 0;
            localStorage.setItem('lastupdates', JSON.stringify(storedUpdates));

            this.isDirty = true;
        }

    }

    private cacheCommon(apipath: string, lastupdate: number) {

        let params = new URLSearchParams();
        params.append('limit', '9999');
        this.getAll(apipath, params).subscribe(response => {

            // set received data to memory
            this[apipath] = response.data;

            // refresh associated data for selects
            this.prepareSelects(apipath);

            // store the data localy
            localStorage.setItem('stored_'+apipath, JSON.stringify(this[apipath]));

            // retrive and update lastupdates for the method with the received timestamp
            let storedUpdates = JSON.parse(localStorage.getItem('lastupdates')) || {};
            storedUpdates[apipath] = lastupdate;
            localStorage.setItem('lastupdates', JSON.stringify(storedUpdates));

            this.commonDataready = ( this.titolari.length > 0 && this.fascicoli.length > 0 && this.amministrazioni.length > 0 && this.mittenti.length > 0 );
        });
    }

    private prepareSelects(apipath: string) {
        this[apipath+'Select'] = $.extend(true, [], this[apipath]) as Select2OptionData[];
        this[apipath+'Enum'] = {};

        switch (apipath) {
            case 'titolari':
                this.titolariSelect.forEach((entry) => {
                    entry.text = entry['codice'] + ' - ' + entry['denominazione'] + ' - ' + entry['descrizione'];
                    this.titolariEnum[entry['id']] = entry['denominazione'];
                    this.titolariIdCodEnum[entry['id']] = entry['codice'];
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

            case 'amministrazioni':
                this.amministrazioniSelect.forEach((entry) => {
                    entry['text'] = entry['codice'] + ' - ' + entry['denominazione'];
                    entry['id'] = String(entry['id']);
                    this._amministrazioniEnum[entry['id']] = entry['denominazione'];
                });
                break;

            case 'mittenti':
                this.mittentiSelect.forEach((entry) => {
                    entry['text'] = entry['denominazione'];
                    this.mittentiEnum[entry['id']] = entry['denominazione'];
                });
                break;
            case 'registri':
                this.registriSelect.forEach((entry) => {
                    entry['text'] = entry['numero_fascicolo'] + ' - ' + entry['argomento'];
                });
                break;
        }
        this[apipath+'Select'].unshift({id: '-1', text: 'Inizia a scrivere per selezionare...'});
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