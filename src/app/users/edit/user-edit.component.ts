import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConfig } from "../../app.config";
import { APICommonService } from '../../_services/index';
import { Observable } from 'rxjs/Observable';

import { Uffici } from '../../_models/uffici'
import { RuoliCipe } from '../../_models/ruoli_cipe'
import { Groups } from '../../_models/groups'

@Component({
    templateUrl: 'user-edit.component.html',
    encapsulation: ViewEncapsulation.None
})

export class UserEditComponent implements OnInit {

    config: any;
    model: any = {};
    error = '';
    mode: string;
    loading= false;
    id: number;

    public uffici$: Observable<Uffici[]>;
    public ruoli_cipe$: Observable<RuoliCipe[]>;
    public groups$: Observable<Groups[]>;

    public select2Options: Select2Options;

    public canEdit: boolean = false;
    public canDelete: boolean = false;

    constructor(private router: Router,
                private route: ActivatedRoute,
                public apiService: APICommonService,
                config: AppConfig,
    ) {
        this.config = config.getConfig();
        this.select2Options = config.select2Options;
        this.uffici$ = this.apiService.subscribeToDataService('uffici');
        this.ruoli_cipe$ = this.apiService.subscribeToDataService('ruoli_cipe');
        this.groups$ = this.apiService.subscribeToDataService('groups');
    }

    ngOnInit() {

        this.apiService.refreshCommonCache();

        this.id = +this.route.snapshot.params['id'];
        this.mode = isNaN(this.id) ? 'create' : 'update';
        this.canEdit = isNaN(this.id) ? this.apiService.userCan('CREATE_USERS') : this.apiService.userCan('EDIT_USERS');
        this.canDelete = this.apiService.userCan('DELETE_USERS');

        switch( this.mode ) {
            case 'create':
                this.loading = false;
                break;

            case 'update':
                this.apiService.getById('users', this.id)
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

    select2Changed(e: any, name: string): void {
        this.model[name] = typeof e.value === 'object' ? e.value.join(',') : e.value;
    }

    cancel( event ) {
        this.router.navigate(['/app/users/list']);
    }

    submit() {
        this.loading = true;

        switch( this.mode ) {
            case 'create':
                this.apiService.create('users', this.model)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/users/list']);
                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;

            case 'update':
                this.apiService.update('users',this.model)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/users/list']);
                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;
        }
    }
}
