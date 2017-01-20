import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { APICommonService } from '../../_services/index';

@Component({
    templateUrl: 'user-edit.component.html'
})

export class UserEditComponent implements OnInit {
    model: any = {};
    error: string = '';
    mode: string;
    loading: boolean = false;
    id: number;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private apiService: APICommonService
    ) {

    }

    ngOnInit() {

        this.id = +this.route.snapshot.params['id'];
        this.mode = isNaN(this.id) ? 'create' : 'update';

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
                            this.error = error;
                            this.loading = false;
                        });
                break;
        }
    }

    cancel( event ) {
        this.router.navigate(['/app/titolari/list']);
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
                            this.error = error;
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
                            this.error = error;
                            this.loading = false;
                        });
                break;
        }
    }
}
