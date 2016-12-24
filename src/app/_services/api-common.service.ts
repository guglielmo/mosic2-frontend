import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import {AppConfig} from '../app.config';

@Injectable()
export class APICommonService {
    config: any;

    constructor(private http: Http, config: AppConfig) {
        this.config = config.getConfig();
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