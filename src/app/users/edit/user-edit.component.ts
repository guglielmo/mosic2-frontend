import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConfig } from "../../app.config";
import { APICommonService } from '../../_services/index';

@Component({
    templateUrl: 'user-edit.component.html',
    encapsulation: ViewEncapsulation.None
})

export class UserEditComponent implements OnInit {

    config: any;
    model: any = {};
    error: string = '';
    mode: string;
    loading: boolean = false;
    id: number;

    public select2Options: Select2Options;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private apiService: APICommonService,
                config: AppConfig,
    ) {
        this.config = config.getConfig();
        this.select2Options = config.select2Options;
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
