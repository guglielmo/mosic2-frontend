import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Titolari } from '../../_models/index';
import { TitolariService } from '../../_services/index';


import { AlertService } from '../../_services/index';

@Component({
    templateUrl: 'titolari-edit.component.html'
})

export class TitolariCreateComponent {
    model: any = {};
    error: string = '';
    loading = false;

    constructor(
        private router: Router,
        private titolariService: TitolariService,
        private alertService: AlertService) { }

    register() {
        this.loading = true;
        this.titolariService.create(this.model)
            .subscribe(
                data => {
                    console.log(data);
                    //this.alertService.success('Registrazione avvenuta con successo', true);
                    this.router.navigate(['/app/titolari/list']);
                },
                error => {
                    console.log(error);
                    this.error = error;
                    //this.alertService.error(error);
                    this.loading = false;
                });
    }
}
