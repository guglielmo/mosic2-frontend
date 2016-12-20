import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {Titolari} from '../../_models/index';
import {TitolariService} from '../../_services/index';

declare var Messenger: any;

@Component({
    templateUrl: 'titolari-edit.component.html'
})

export class TitolariEditComponent {
    model: any = {};
    error: string = '';
    mode: string;
    loading: boolean = false;
    id: number;

    constructor(private router: Router,
                private titolariService: TitolariService,
                private route: ActivatedRoute) {
    }

    private ngOnInit() {

        this.id = +this.route.snapshot.params['id'];
        this.mode = isNaN(this.id) ? 'create' : 'update';

        switch( this.mode ) {
            case 'create':
                break;
                
            case 'update':
                this.titolariService.getById(this.id)
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

    submit() {
        this.loading = true;

        switch( this.mode ) {
            case 'create':
                this.titolariService.create(this.model)
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
                this.titolariService.update(this.model)
                    .subscribe(
                        data => {
                        },
                        error => {
                            this.error = error;
                            this.loading = false;
                        });
                break;
        }
    }
}
