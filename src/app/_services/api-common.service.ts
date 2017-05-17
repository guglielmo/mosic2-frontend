import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Select2OptionData } from 'ng2-select2';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Warehouse } from 'ngx-warehouse';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as _ from 'lodash';


import { Titolari, Fascicoli, Registri, Amministrazioni, Mittenti, Uffici, RuoliCipe } from '../_models/index';

import {AppConfig} from '../app.config';

@Injectable()
export class APICommonService {
    public config: any;
    public configFn: any;

    public commonDataready = false;
    public activeRequests = 0;
    public isDirty = false;

    private _allData: any = {};
    private _allData$: any = {};
    public dataEnum: any = {};

    private currentStorageVersion = '73';
    private storageVersion: string = localStorage.getItem('storageVersion');

    private cachedApiDataMetods: string[] = [
        'amministrazioni',
        'mittenti',
        'titolari',
        'fascicoli',
        'registri',
        'groups',
        'uffici',
        'ruoli_cipe',
        'tags',
        'precipe',
        'firmatari',
        'cipe',
        'firmataritipo',
        'cipeesiti',
        'cipeesititipo',
        'cipeargomentitipo',
        'users',
        'delibere'

/*        'delibere',
        'adempimenti',
        'monitor'*/
    ];

    private commonData: string[] = [
        'amministrazioni',
        'mittenti',
        'titolari',
        'fascicoli',
        'registri',
        'groups',
        'uffici',
        'ruoli_cipe',
        'tags',
        'precipe',
        'firmatari',
        'cipe',
        'firmataritipo',
        'cipeesiti',
        'cipeesititipo',
        'cipeargomentitipo',
        'users',
        'delibere'
    ];

    constructor( private http: Http,
                 public warehouse: Warehouse,
                 config: AppConfig
    ) {
        this.config = config.getConfig();
        this.configFn = config;

        // creates containers for local in memory storage and Observable data arrays
        this.cachedApiDataMetods.forEach( apipath => {
            if ( !this._allData$[apipath] ) {
                // creates data containers
                this._allData[apipath] = [];
                this.dataEnum[apipath] = {};
                // creates Observables subjects
                this._allData$[apipath] = <BehaviorSubject<any[]>> new BehaviorSubject([]);
            }
        });

        this.warehouse.set('apiServiceLastInitTime', Date.now() );

        this.warehouse.get('apiServiceLastInitTime').subscribe(data => {
            console.log('apiServiceLastInitTime', data);  // <-- returns null at first execution
        });
    }

    public subscribeToDataService( apipath: string ): Observable<any[]> {
        return this._allData$[apipath].asObservable();
    }

    // PUBLIC helper methods
    public getAll(apipath: string, params?: URLSearchParams) {
        this.startingRequest(apipath);
        const query = params ? '?' + params.toString() : '';
        return this.http.get(this.config.baseAPIURL + '/api/' + apipath + query, this.jwt())
                        .map((response: Response) => response.json())
                        .catch((response: Response) => this.handleError(response));
    }

    public getById(apipath: string, id: number | string) {
        this.startingRequest(apipath);
        return this.http.get(this.config.baseAPIURL + '/api/' + apipath + '/' + id, this.jwt())
                        .map((response: Response)  => response.json())
                        .catch((response: Response) => this.handleError(response));
    }

    public create(apipath: string, data: any) {
        this.startingRequest(apipath);
        this.setDirty(apipath);
        return this.http.post(this.config.baseAPIURL + '/api/' + apipath, data, this.jwt())
                        .map((response: Response) => response.json())
                        .catch((response: Response) => this.handleError(response));
    }

    public update(apipath: string, data: any) {
        this.startingRequest(apipath);
        this.setDirty(apipath);
        return this.http.put(this.config.baseAPIURL + '/api/' + apipath + '/' + data.id, data, this.jwt())
                        .map((response: Response) => response.json())
                        .catch((response: Response) => this.handleError(response));
    }

    public delete(apipath: string, id: number | string) {
        this.startingRequest(apipath);
        this.setDirty(apipath);
        return this.http.delete(this.config.baseAPIURL + '/api/' + apipath + '/' + id, this.jwt())
                        .map((response: Response) => response.json())
                        .catch((response: Response) => this.handleError(response));
    }

    public deleteFile(apipath: string, idContainer: number | string, idFile: number) {
        this.startingRequest(apipath);
        this.setDirty(apipath);
        return this.http.delete(this.config.baseAPIURL + '/api/' + apipath + '/' + idContainer + '/upload/' + idFile, this.jwt())
                        .map((response: Response) => response.json())
                        .catch((response: Response) => this.handleError(response));
    }

    private setDirty(apipath: string) {

        if (this.cachedApiDataMetods.indexOf(apipath) !== -1) {

            //
            // retrive and set last update to zero for the method
            //
            const storedUpdates = JSON.parse(localStorage.getItem('lastupdates')) || {};
            storedUpdates[apipath] = 0;
            localStorage.setItem('lastupdates', JSON.stringify(storedUpdates));

            this.isDirty = true;
        }

    }

    private getLastUpdates() {
        this.startingRequest('lastupdates');
        return this.http.get(this.config.baseAPIURL + '/api/lastupdates', this.jwt())
                        .map((response: Response) => response.json())
                        .catch((response: Response) => this.handleError(response));
    }

    private startingRequest ( apipath: string ) {
        this.activeRequests++;
        // console.log(this.activeRequests);
    }

    private finishRequest ( apipath: string ) {
        this.activeRequests--;
        // console.log(this.activeRequests);
    }

    private handleError (error: Response | any) {

        console.log('handle',error);

        let errMsg: string;
        if (error instanceof Response) {

            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err.message}`;

            const usermsg = err.message ? err.message : 'Errore non previsto, consultare la console per ulteriori informazioni';
            this.notifyError(usermsg);

        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error('>>>>', errMsg);

        return Observable.throw(errMsg);
    }

    public notifyError (msg: any) {
        this.configFn.notify(msg);
    }

    public refreshCommonCache() {

        this.getLastUpdates().subscribe(response => {

            //
            // retrieve new and last stored updates
            //
            const storedLastUpdates = JSON.parse(localStorage.getItem('lastupdates')) || {};
            const lastupdates = response.data;

            //
            // for every cached API method
            //
            for (let i = 0; i < this.cachedApiDataMetods.length; i++) {
                const apipath = this.cachedApiDataMetods[i];

                //
                // if storage version didn't change or data is not stored or fresher on the backend
                //
                if (this.storageVersion !== this.currentStorageVersion
                    || !storedLastUpdates[apipath]
                    || lastupdates[apipath] > storedLastUpdates[apipath]
                ) {

                    //
                    // initiate a cache priming
                    //
                    this.cacheCommonIDB(apipath, lastupdates[apipath]);

                } else {

                    //
                    // get it from local data warehouse
                    //
                    this.warehouse.get('stored_' + apipath).subscribe(
                        data => {
                            if(!Array.isArray(data)) {
                                this.notifyError("I dati registrati nella memoria locale per " + apipath + " non sono validi. Sarà effettuato un" +
                                    " nuovo tentativo di ricaricamento dal server.");
                                localStorage.setItem('lastupdates', JSON.stringify({}));
                                this.cacheCommonIDB(apipath, lastupdates[apipath]);
                                return;
                            }

                            //
                            // stores data in memory
                            //
                            this._allData[apipath] = data;

                            //
                            // checks if all cached api methods are loaded
                            //
                            let checkIsReady = true;
                            _.each(this.commonData, v => {
                                //console.log(v, this._allData);
                                if (this._allData[v].length === 0) {
                                    checkIsReady = false;
                                    return false; // <-- note: this is the lodash way to break iteration;
                                }
                            });
                            this.commonDataready = checkIsReady;

                            //
                            // creates a data hashmap for a convenient and quick lookup access by id
                            //
                            _.each(this._allData[apipath], item => { this.dataEnum[apipath][item.id] = item; });

                            //
                            // notifies the subscribers with the new data
                            //
                            this._allData$[apipath].next(this._allData[apipath]);
                        },
                        error => { console.log(error); }
                    );
                }
            }

            localStorage.setItem('storageVersion', this.currentStorageVersion);
        });

    }

    private cacheCommonIDB(apipath: string,  lastupdate: number) {

        const params = new URLSearchParams();
        params.append('limit', '9999');

        this.getAll(apipath, params).subscribe(
            response => {

                if(!Array.isArray(response.data)) {
                    this.notifyError('La risposta del server per la API ' + apipath + ' non è valida');
                    return;
                }

                //
                // extends all items with a custom 'text' property which is used by select2 fields
                // !!! note that prepareSelect2 doesn't return a new extended copy but modifies the passed data directly to save memory !!!
                //
                this.prepareSelect2(apipath, response.data);

                //
                // stores data in memory
                //
                this._allData[apipath] = response.data;

                //
                // creates a data hashmap for a convenient and quick lookup access by id
                //
                _.each(this._allData[apipath], item => { this.dataEnum[apipath][item.id] = item;  } );

                //
                // notifies the subscribers with the new data
                //
                this._allData$[apipath].next(this._allData[apipath]);

                //
                // stores the information on either LocalStorage/WebSQL/IndexedDB
                //
                this.warehouse.set('stored_' + apipath, this._allData[apipath]);

                //
                // retrives and update lastupdates for the apipath with the received timestamp
                //
                const storedUpdates = JSON.parse(localStorage.getItem('lastupdates')) || {};
                storedUpdates[apipath] = lastupdate;
                localStorage.setItem('lastupdates', JSON.stringify(storedUpdates));

                //
                // checks if all cached api methods are loaded
                //
                let checkIsReady = true;
                _.each(this.commonData, v => {
                    if (this._allData[v].length === 0) {
                        checkIsReady = false;
                        return false; // <-- this is the lodash way to break iteration;
                    }
                });
                this.commonDataready = checkIsReady;

            },
            error => {
                this.notifyError('Errore nel caricamento di "' + apipath + '" dalla API');
            }
        );
    }

    private prepareSelect2( apipath: string, data: any[] ) {

        switch (apipath) {
            case 'titolari':
                _.each(data, (item) => { item.text = item['codice'] + ' - ' + item['denominazione'] + ' - ' + item['descrizione'] } );
                break;
            case 'fascicoli':
                _.each(data, (item) => { item.text = item['numero_fascicolo'] + ' - ' + item['argomento'] } );
                break;
            case 'amministrazioni':
                _.each(data, (item) => { item.text = item['codice'] + ' - ' + item['denominazione']; item.id = String(item.id) });
                break;
            case 'mittenti':
                _.each(data, (item) => { item.text = item['denominazione'] } );
                break;
            case 'registri':
                _.each(data, (item) => { item.text = item['id'] + ' - ' + item['oggetto'] } );
                break;
            case 'uffici':
                _.each(data, (item) => { item.text = item['id'] + ' - ' + item['denominazione'] } );
                break;
            case 'ruoli_cipe':
                _.each(data, (item) => { item.text = item['denominazione'] } );
                break;
            case 'firmatari':
                _.each(data, (item) => { item.text = item['denominazione_estesa'] } );
                break;
            case 'firmataritipo':
                _.each(data, (item) => { item.text = item['denominazione'] } );
                break;
            case 'users':
                _.each(data, (item) => { item.text = item['denominazione'] = item['lastName'] + ' ' + item['firstName'] } );
                break;
        }
    }

    //
    // JWT helper method
    //
    private jwt() {
        // create authorization header with jwt token
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            const headers = new Headers({'Authorization': 'Bearer ' + currentUser.token});
            return new RequestOptions({headers: headers});
        }
    }
}
