import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { APICommonService } from '../../_services/index';

@Component({
    templateUrl: 'user-edit.component.html'
})

export class UserCreateComponent {
    model: any = {};
    error: string = '';
    loading = false;

    constructor(
        private router: Router,
        private apiService: APICommonService
    ) { }

    register() {
        this.loading = true;
        this.apiService.create('users', this.model)
            .subscribe(
                data => {
                    console.log(data);
                    //this.alertService.success('Registrazione avvenuta con successo', true);
                    this.router.navigate(['/app/users/list']);
                },
                error => {
                    console.log(error);
                    this.error = error;
                    //this.alertService.error(error);
                    this.loading = false;
                });
    }
}
