import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import {AppConfig} from '../app.config';
import { User } from '../_models/index';

@Injectable()
export class UserService {
    config: any;

    constructor(private http: Http, config: AppConfig) {
        this.config = config.getConfig();
    }

    getAll() {
        return this.http.get( this.config.baseAPIURL + '/api/users', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get( this.config.baseAPIURL + '/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(user: User) {
        return this.http.post( this.config.baseAPIURL + '/api/users', user, this.jwt()).map((response: Response) => response.json());
    }

    update(user: User) {
        return this.http.put( this.config.baseAPIURL + '/api/users/' + user.id, user, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete( this.config.baseAPIURL + '/api/users/' + id, this.jwt()).map((response: Response) => response.json());
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