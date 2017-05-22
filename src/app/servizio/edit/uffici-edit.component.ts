import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Uffici } from '../../_models/index';

import { APICommonService } from '../../_services/index';

@Component({
    templateUrl: 'uffici-edit.component.html'
})

export class UfficiEditComponent implements OnInit {
    model: Uffici = new Uffici;
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
        this.canEdit = isNaN(this.id) ? this.apiService.userCan('CREATE_UFFICI') : this.apiService.userCan('EDIT_UFFICI');
        this.canDelete = this.apiService.userCan('DELETE_UFFICI');

        switch( this.mode ) {
            case 'create':
                this.model.disattivo_ufficio = '0';
                this.model.solo_delibere = '0';
                this.loading = false;
                break;
                
            case 'update':
                this.apiService.getById('uffici', this.id)
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
        this.router.navigate(['/app/uffici/list']);
    }

    submit() {
        this.loading = true;

        switch( this.mode ) {
            case 'create':
                this.apiService.create('uffici', this.model)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/uffici/list']);
                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;

            case 'update':
                this.apiService.update('uffici',this.model)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/uffici/list']);
                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;
        }
    }
}
