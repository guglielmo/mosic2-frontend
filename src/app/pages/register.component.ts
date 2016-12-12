import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, UserService } from '../_services/index';

@Component({
    templateUrl: 'register.component.html'
})

export class RegisterComponent {
    model: any = {};
    error: string = '';
    loading = false;

    constructor(
        private router: Router,
        private userService: UserService,
        private alertService: AlertService) { }

    register() {
        this.loading = true;
        this.userService.create(this.model)
            .subscribe(
                data => {
                    console.log(data);
                    //this.alertService.success('Registrazione avvenuta con successo', true);
                    this.router.navigate(['/pages/login']);
                },
                error => {
                    console.log(error);
                    this.error = error;
                    //this.alertService.error(error);
                    this.loading = false;
                });
    }
}
