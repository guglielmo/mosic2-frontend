import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import {AppConfig} from '../app.config';
import { Titolari } from '../_models/index';

@Injectable()
export class TitolariService {
    config: any;

    constructor(private http: Http, config: AppConfig) {
        this.config = config.getConfig();
    }

    getAll() {
        return this.http.get( this.config.baseAPIURL + '/api/titolari', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get( this.config.baseAPIURL + '/api/titolari/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(titolari: Titolari) {
        return this.http.post( this.config.baseAPIURL + '/api/titolari', titolari, this.jwt()).map((response: Response) => response.json());
    }

    update(titolari: Titolari) {
        return this.http.put( this.config.baseAPIURL + '/api/titolari/' + titolari.id, titolari, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete( this.config.baseAPIURL + '/api/titolari/' + id, this.jwt()).map((response: Response) => response.json());
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