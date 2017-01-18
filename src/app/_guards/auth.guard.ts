import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { APICommonService } from '../_services/api-common.service'

@Injectable()
export class AuthGuard implements CanActivate {

    private cached: boolean = false;

    constructor(private router: Router,
                private apiService: APICommonService
    ) { }

    canActivate() {
        if (localStorage.getItem('currentUser')) {
            // logged in so return true
            if(this.cached === false) {
                this.apiService.cacheData();
                this.cached = true;
            }

            return true;
        }

        // not logged in so redirect to login page
        this.router.navigate(['/login']);
        return false;
    }
}