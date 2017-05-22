import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';


import { Firmatari } from '../../_models/firmatari';

import { APICommonService } from '../../_services/index';
import { AppConfig } from '../../app.config';

@Component({
    templateUrl: 'firmatari-edit.component.html'
})

export class FirmatariEditComponent implements OnInit {

    private config: any;
    public model: Firmatari = new Firmatari;
    public error = '';
    public mode: string;
    public loading = true;
    private id: number;

    public firmataritipo$: Observable<any[]>;

    public select2Options: Select2Options;

    public canEdit: boolean = false;
    public canDelete: boolean = false;

    constructor(private router: Router,
                private route: ActivatedRoute,
                config: AppConfig,
                public apiService: APICommonService
    ) {
        this.config = config.getConfig();
        this.select2Options = config.select2Options;

        this.firmataritipo$ = this.apiService.subscribeToDataService('firmataritipo');

    }

    ngOnInit() {
        this.apiService.refreshCommonCache();

        this.id = +this.route.snapshot.params['id'];
        this.mode = isNaN(this.id) ? 'create' : 'update';
        this.canEdit = isNaN(this.id) ? this.apiService.userCan('CREATE_FIRMATARI') : this.apiService.userCan('EDIT_FIRMATARI');
        this.canDelete = this.apiService.userCan('DELETE_FIRMATARI');

        switch( this.mode ) {
            case 'create':
                this.loading = false;
                break;
                
            case 'update':
                this.apiService.getById('firmatari', this.id)
                    .subscribe(
                        response => {
                            this.model = response.data;
                            this.loading = false;

                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;
        }
    }

    cancel( event ) {
        this.router.navigate(['/app/firmatari/list']);
    }

    submit() {
        this.loading = true;

        switch( this.mode ) {
            case 'create':
                this.apiService.create('firmatari', this.model)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/firmatari/list']);
                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;

            case 'update':
                this.apiService.update('firmatari',this.model)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/firmatari/list']);
                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;
        }
    }

    select2Changed(e: any, name: string): void {
        this.model[name] = typeof e.value === 'object' ? e.value.join(',') : e.value;
    }
}
