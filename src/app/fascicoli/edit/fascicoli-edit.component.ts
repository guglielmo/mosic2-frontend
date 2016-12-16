import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Fascicoli } from '../../_models/index';
import { FascicoliService } from '../../_services/index';


import { AlertService } from '../../_services/index';

@Component({
    templateUrl: 'fascicoli-edit.component.html'
})

export class FascicoliCreateComponent {
    model: any = {};
    error: string = '';
    loading = false;

    constructor(
        private router: Router,
        private fascicoliService: FascicoliService,
        private alertService: AlertService) { }

    register() {
        this.loading = true;
        this.fascicoliService.create(this.model)
            .subscribe(
                data => {
                    console.log(data);
                    //this.alertService.success('Registrazione avvenuta con successo', true);
                    this.router.navigate(['/app/fascicoli/list']);
                },
                error => {
                    console.log(error);
                    this.error = error;
                    //this.alertService.error(error);
                    this.loading = false;
                });
    }
}
