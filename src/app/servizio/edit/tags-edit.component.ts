import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { APICommonService } from '../../_services/index';

@Component({
    templateUrl: 'tags-edit.component.html'
})

export class TagsEditComponent implements OnInit {
    model: any = {};
    error: string = '';
    mode: string;
    loading: boolean = true;
    id: number;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private apiService: APICommonService
    ) {

    }

    ngOnInit() {
        this.apiService.refreshCommonCache();

        this.id = +this.route.snapshot.params['id'];
        this.mode = isNaN(this.id) ? 'create' : 'update';

        switch( this.mode ) {
            case 'create':
                this.loading = false;
                break;
                
            case 'update':
                this.apiService.getById('tags', this.id)
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
        this.router.navigate(['/app/tags/list']);
    }

    submit() {
        this.loading = true;

        switch( this.mode ) {
            case 'create':
                this.apiService.create('tags', this.model)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/tags/list']);
                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;

            case 'update':
                this.apiService.update('tags',this.model)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/tags/list']);
                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;
        }
    }
}
