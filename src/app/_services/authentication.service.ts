import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';


import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import {AppConfig} from '../app.config';


@Injectable()
export class AuthenticationService {
    private config: any;

    constructor(private http: Http,
                private appconfig: AppConfig,
    ) {
        this.config = appconfig.getConfig();
    }

    public login(email: string, password: string) {
        return this.http.post( this.config.baseAPIURL + '/api/authenticate', JSON.stringify({ email: email, password: password }))
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user.data && user.data.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user.data));
                }
            });
    }

    public logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}