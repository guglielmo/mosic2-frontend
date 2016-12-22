import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import {AppConfig} from '../app.config';
import { Registri } from '../_models/index';

@Injectable()
export class RegistriService {
    config: any;

    constructor(private http: Http, config: AppConfig) {
        this.config = config.getConfig();
    }

    getAll() {
        return this.http.get( this.config.baseAPIURL + '/api/registri', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get( this.config.baseAPIURL + '/api/registri/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(registri: Registri) {
        return this.http.post( this.config.baseAPIURL + '/api/registri', registri, this.jwt()).map((response: Response) => response.json());
    }

    update(registri: Registri) {
        return this.http.put( this.config.baseAPIURL + '/api/registri/' + registri.id, registri, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete( this.config.baseAPIURL + '/api/registri/' + id, this.jwt()).map((response: Response) => response.json());
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