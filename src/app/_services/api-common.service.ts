import {Injectable} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Headers, Http, RequestOptions, Response, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Warehouse} from 'ngx-warehouse';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as _ from 'lodash';

import {AppConfig} from '../app.config';

@Injectable()
export class APICommonService {
    public config: any;
    public configFn: any;

    public userCapabilities: any = null;

    public commonDataready = false;
    public activeRequests = 0;
    public isDirty = false;

    private _allData: any = {};
    private _allData$: any = {};
    public dataEnum: any = {};

    public currentUserID: number;
    public currentUserGroup: number;
    private currentStorageVersion = '56';
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
        'delibere',
        'adempimenti',
        'adempimenti_scadenze',
        'adempimenti_tipologie',
        'adempimenti_ambiti',
        'adempimenti_soggetti',
        'adempimenti_azioni',
        /*
                'monitor',
                'monitor/group'*/
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
        'delibere',
        'adempimenti',
        'adempimenti_scadenze',
        'adempimenti_tipologie',
        'adempimenti_ambiti',
        'adempimenti_soggetti',
        'adempimenti_azioni',
        /*
                'monitor',
                'monitor/group'*/
    ];

    constructor(
                private http: Http,
                private datePipe: DatePipe,
                public warehouse: Warehouse,
                config: AppConfig
    ) {
        this.config = config.getConfig();
        this.configFn = config;

        // console.log(this.userCapabilities);
        this.createInMemoryStorage();

        this.warehouse.set('apiServiceLastInitTime', Date.now() );

        this.warehouse.get('apiServiceLastInitTime').subscribe(data => {
            console.log('apiServiceLastInitTime', data);  // <-- returns null at first execution
        });

        this.setUserCapabilities();
    }

    private createInMemoryStorage() {

        // console.log('createInMemoryStorage', this.cachedApiDataMetods);

        // creates containers for local in memory storage and Observable data arrays
        this.cachedApiDataMetods.forEach( apipath => {
            if ( !this._allData$[apipath] ) {
                // creates data containers
                this._allData[apipath] = null;
                this.dataEnum[apipath] = {};
                // creates Observables subjects
                this._allData$[apipath] = <BehaviorSubject<any[]>> new BehaviorSubject([]);
            }
        });
    }

    public subscribeToDataService( apipath: string ): Observable<any[]> {

        // if data is not cached by default
        if ( !this._allData$[apipath] ) {
            // create in memory container, enum container and observable subject
            this._allData[apipath] = [];
            this.dataEnum[apipath] = {};
            this._allData$[apipath] = <BehaviorSubject<any[]>> new BehaviorSubject([]);
            // loads the subscribed data
            this.cacheCommonIDB(apipath, 0);
        }
        return this._allData$[apipath].asObservable();

    }

    // PUBLIC helper methods
    public getAll(apipath: string, params?: URLSearchParams): Observable<any> {

        if ( this.apiCan( 'READ_'+apipath.toUpperCase() ) ) {

            this.startingRequest(apipath);
            const query = params ? '?' + params.toString() : '';
            return this.http.get(this.config.baseAPIURL + '/api/' + apipath + query, this.jwt())
                .map((response: Response) => response.json())
                .catch((response: Response) => this.handleError(response));
        }

        return Observable.of<any>({data: []});
    }

    public getById(apipath: string, id: number | string): Observable<any> {

        if ( this.apiCan( 'READ_'+apipath.toUpperCase() ) ) {

            this.startingRequest(apipath);
            return this.http.get(this.config.baseAPIURL + '/api/' + apipath + '/' + id, this.jwt())
                .map((response: Response)  => response.json())
                .catch((response: Response) => this.handleError(response));
        }

        return Observable.of<any>({data: []});
    }

    public create(apipath: string, data: any) {

        if ( this.apiCan( 'CREATE_'+apipath.toUpperCase() ) ) {

            this.startingRequest(apipath);
            this.setDirty(apipath);
            return this.http.post(this.config.baseAPIURL + '/api/' + apipath, data, this.jwt())
                .map((response: Response) => response.json())
                .catch((response: Response) => this.handleError(response));
        }

        return Observable.of<any>({data: []});
    }

    public update(apipath: string, data: any) {

        if ( this.apiCan( 'EDIT_'+apipath.toUpperCase() ) ) {

            this.startingRequest(apipath);
            this.setDirty(apipath);
            return this.http.put(this.config.baseAPIURL + '/api/' + apipath + '/' + data.id, data, this.jwt())
                .map((response: Response) => response.json())
                .catch((response: Response) => this.handleError(response));
        }

        return Observable.of<any>({data: []});
    }

    public delete(apipath: string, id: number | string) {

        if ( this.apiCan( 'DELETE_'+apipath.toUpperCase() ) ) {

            this.startingRequest(apipath);
            this.setDirty(apipath);
            return this.http.delete(this.config.baseAPIURL + '/api/' + apipath + '/' + id, this.jwt())
                .map((response: Response) => response.json())
                .catch((response: Response) => this.handleError(response));
        }

        return Observable.of<any>({data: []});
    }

    public deleteFile(apipath: string, idContainer: number | string, idFile: number) {
        this.startingRequest(apipath);
        this.setDirty(apipath);
        return this.http.delete(this.config.baseAPIURL + '/api/' + apipath + '/' + idContainer + '/upload/' + idFile, this.jwt())
                        .map((response: Response) => response.json())
                        .catch((response: Response) => this.handleError(response));
    }

    public isDataReady( apipaths: string[] ): boolean {
        let checkIsReady = true;
        _.each(apipaths, v => {
            //console.log(v, this._allData);
            if (!this._allData[v] || !Array.isArray(this._allData[v])) {
                checkIsReady = false;
                return false; // <-- note: this is the lodash way to break iteration;
            }
        });
        return checkIsReady;
    }

    public getDataArray(apipath): any[] {
        return this._allData[apipath];
    }

    public addCachedApiDataMethods(apipath: string) {
        if (this.cachedApiDataMetods.indexOf(apipath) === -1) {
            this.cachedApiDataMetods.push(apipath);
        }

        if ( !this._allData$[apipath] ) {
            // creates data containers
            this._allData[apipath] = null;
            this.dataEnum[apipath] = {};
            // creates Observables subjects
            this._allData$[apipath] = <BehaviorSubject<any[]>> new BehaviorSubject([]);
        }
    }

    public purgeCache() {

        localStorage.removeItem('lastupdates');
        this._allData = {};
        this._allData$ = {};
        this.dataEnum = {};
        this.createInMemoryStorage();

/*        this.warehouse.destroy().subscribe(
            (success) => {
                console.log('cache svuotata');
                // do something on success
            },
            (error) => {
                console.log('errore nella pulizia della cache: ' + error);
                // handle the error
            }
        );*/
    }

    public refreshCommonCache() {

        this.getLastUpdates().subscribe(
            response => {

                //
                // retrieve new and last stored updates
                //
                const storedLastUpdates = JSON.parse(localStorage.getItem('lastupdates')) || {};
                const lastupdates = response.data;
                const storageVersion = localStorage.getItem('storageVersion');


                // console.log(lastupdates,storedLastUpdates);

                //
                // for every cached API method
                //
                for (let i = 0; i < this.cachedApiDataMetods.length; i++) {
                    const apipath = this.cachedApiDataMetods[i];
                    const apipathLU = apipath.replace(/\//g,'_' );

                    //console.log(apipath,apipathLU);

                    //
                    // if storage version didn't change or data is not stored or fresher on the backend
                    //
                    if (storageVersion !== this.currentStorageVersion
                        || !storedLastUpdates[apipathLU]
                        || lastupdates[apipathLU] > storedLastUpdates[apipathLU]
                    ) {

                        //
                        // initiate a cache priming
                        //
                        this.cacheCommonIDB(apipath, lastupdates[apipathLU]);

                    } else {

                        //
                        // get it from local data warehouse
                        //
                        this.loadDataFromWareHouse(apipath, lastupdates);

                    }
                }

                localStorage.setItem('storageVersion', this.currentStorageVersion);
            },
            error => {

                this.notifyError('Impossibile caricare gli ultimi aggiornamenti dal server');

                const emptyLastUpdates = { data: {} };

                for (let i = 0; i < this.cachedApiDataMetods.length; i++) {
                    const apipath = this.cachedApiDataMetods[i];
                    this.loadDataFromWareHouse(apipath, emptyLastUpdates);
                }
            }
        );

    }

    private loadDataFromWareHouse ( apipath: string, lastupdates ) {
        this.warehouse.get('stored_' + apipath).subscribe(
            data => {
                if (!Array.isArray(data)) {
                    this.notifyError('I dati registrati nella memoria locale per ' +
                        apipath + ' non sono validi. Sarà effettuato un' +
                        ' nuovo tentativo di ricaricamento dal server.');
                    localStorage.setItem('lastupdates', JSON.stringify({}));
                    this.cacheCommonIDB(apipath, lastupdates[apipath]);
                    return;
                }

                //
                // stores data in memory
                //
                this._allData[apipath] = data;

                //
                // creates a data hashmap for a convenient and quick lookup access by id
                //
                _.each(this._allData[apipath], item => { this.dataEnum[apipath][item.id] = item; });

                //
                // updates current user capabilities if we just loaded new groups capabilities
                //
                if ( apipath === 'groups') {
                    this.setUserCapabilities();
                }

                //
                // notifies the subscribers with the new data
                //
                this._allData$[apipath].next(this._allData[apipath]);

                //
                // checks if all cached api methods are loaded
                //
                this.commonDataready = this.isDataReady(this.commonData);
            },
            error => { console.log(error); }
        );
    }

    public notifyError (msg: any) {
        this.configFn.notify(msg);
    }

    public userCan (capability: string): boolean {

        return this.userCapabilities && this.userCapabilities['ROLE_'+capability] || false;
    }

    private apiCan (capability: string): boolean {

        capability = capability.replace(/\//g, '_');

        // console.log(this.userCapabilities);

        if ( this.userCapabilities && !this.userCapabilities['ROLE_'+capability] ) {

            this.notifyError('Permesso negato: non disponi delle autorizzazioni per ' + capability);
            return false;
        }
        return true;
    }

    public setUserCapabilities () {

        let capabilities = [];

        // get the current user object and group id
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        // console.log('setUserCapabilities', currentUser);

        if ( currentUser ) {
            const group = currentUser.id_group[0];

            // check the capabilities by Group ID if the data was already loaded
            if ( this.dataEnum['groups'][group] && Array.isArray(this.dataEnum['groups'][group]['roles'])) {

                capabilities = this.dataEnum['groups'][group]['roles'];

                // otherwise uses the login time declared capabilities (from /api/authenticate response)
            } else if (currentUser && Array.isArray(currentUser.capabilities)) {

                capabilities = currentUser.capabilities;

            } else {

                this.notifyError('Impossibile determinare i permessi dell\'utente');

            }
        }

        // maps user capabilities to object for fast evaluation
        this.userCapabilities = _.zipObject(capabilities, _.map(capabilities, () => { return true } ));

        //console.log(this.userCapabilities);

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

        // console.log('handle', error);

        let errMsg: string;
        if (error instanceof Response) {

            console.log(error);

            const body = error.json() || '';

            // console.log('body:', body);
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

    private cacheCommonIDB(apipath: string,  lastupdate: number) {

        const params = new URLSearchParams();
        params.append('limit', '99999');

        this.getAll(apipath, params).subscribe(
            response => {

                if (!Array.isArray(response.data)) {
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
                // updates current user capabilities if we just loaded new groups capabilities
                //
                if ( apipath === 'groups') {
                    this.setUserCapabilities();
                }

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
                const apipathLU = apipath.replace(/\//g, '_');
                storedUpdates[apipathLU] = lastupdate;
                localStorage.setItem('lastupdates', JSON.stringify(storedUpdates));

                //
                // checks if all cached api methods are loaded
                //
                this.commonDataready = this.isDataReady(this.commonData);

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
            case 'registri':
                _.each(data, (item) => { item.text = item['id'] + ' - ' + item['oggetto'] } );
                break;
            case 'firmatari':
                _.each(data, (item) => { item.text = item['denominazione_estesa'] } );
                break;
            case 'users':
                _.each(data, (item) => { item.text = item['denominazione'] = item['lastName'] + ' ' + item['firstName'] } );
                break;
            case 'groups':
                _.each(data, (item) => { item.text = item['name'] } );
                break;
            case 'delibere':
                _.each(data, (item) => { item.text = item['numero'] + ' - ' + item['argomento'] } );
                break;
            case 'cipe':
                _.each(data, (item) => { item.text = this.transformDate(item['data'],'dd/MM/yyyy') } );
                break;
            case 'uffici':
            case 'mittenti':
            case 'ruoli_cipe':
            case 'firmataritipo':
            case 'tags':
            case 'adempimenti_tipologie':
            case 'adempimenti_ambiti':
            case 'adempimenti_soggetti':
            case 'adempimenti_azioni':
                _.each(data, (item) => { item.text = item['denominazione'] } );
                break;
        }
    }

    //
    // JWT helper method
    //
    private jwt() {
        // create authorization header with jwt token
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.currentUserID = currentUser.id;
        this.currentUserGroup = currentUser.group;
        if (currentUser && currentUser.token) {
            const headers = new Headers({'Authorization': 'Bearer ' + currentUser.token});
            return new RequestOptions({headers: headers});
        }
    }

    public transformDate(date, format) {
        return this.datePipe.transform(date, format);
    }
}
