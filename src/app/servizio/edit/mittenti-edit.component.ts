import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { APICommonService } from '../../_services/index';

@Component({
    templateUrl: 'mittenti-edit.component.html'
})

export class MittentiEditComponent implements OnInit {
    model: any = {};
    error = '';
    mode: string;
    loading= true;
    id: number;

    public canEdit: boolean = false;
    public canDelete: boolean = false;

    constructor(private router: Router,
                private route: ActivatedRoute,
                public apiService: APICommonService
    ) {

    }

    ngOnInit() {
        this.apiService.refreshCommonCache();

        this.id = +this.route.snapshot.params['id'];
        this.mode = isNaN(this.id) ? 'create' : 'update';
        this.canEdit = isNaN(this.id) ? this.apiService.userCan('CREATE_MITTENTI') : this.apiService.userCan('EDIT_MITTENTI');
        this.canDelete = this.apiService.userCan('DELETE_MITTENTI');

        switch( this.mode ) {
            case 'create':
                this.loading = false;
                break;
                
            case 'update':
                this.apiService.getById('mittenti', this.id)
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
        this.router.navigate(['/app/mittenti/list']);
    }

    submit() {
        this.loading = true;

        switch( this.mode ) {
            case 'create':
                this.apiService.create('mittenti', this.model)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/mittenti/list']);
                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;

            case 'update':
                this.apiService.update('mittenti',this.model)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/mittenti/list']);
                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;
        }
    }
}
