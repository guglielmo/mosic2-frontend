import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Titolari } from '../../_models/index';
import { APICommonService } from '../../_services/index';

@Component({
    templateUrl: 'titolari-edit.component.html'
})

export class TitolariEditComponent implements OnInit {
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
                break;
                
            case 'update':
                this.apiService.getById('titolari', this.id)
                    .subscribe(
                        data => {
                            this.model = data;
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
                this.apiService.create('titolari', this.model)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/titolari/list']);
                        },
                        error => {
                            this.error = error;
                            this.loading = false;
                        });
                break;

            case 'update':
                this.apiService.update('titolari',this.model)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/titolari/list']);
                        },
                        error => {
                            this.error = error;
                            this.loading = false;
                        });
                break;
        }
    }
}
