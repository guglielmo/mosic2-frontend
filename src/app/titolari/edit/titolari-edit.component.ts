import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';


import { Titolari, Fascicoli, Uffici } from '../../_models/index';

import { APICommonService } from '../../_services/index';
import { AppConfig } from '../../app.config';

@Component({
    templateUrl: 'titolari-edit.component.html'
})

export class TitolariEditComponent implements OnInit {

    private config: any;
    public model: Titolari = new Titolari;
    public error = '';
    public mode: string;
    public loading = true;
    private id: number;

    private filteredCount = {count: 0};
    private uffici$: Observable<Uffici[]>;
    private fascicoli$: Observable<Fascicoli[]>;

    public select2Options: Select2Options;

    constructor(private router: Router,
                private route: ActivatedRoute,
                config: AppConfig,
                public apiService: APICommonService
    ) {
        this.config = config.getConfig();
        this.select2Options = config.select2Options;

        this.uffici$ = this.apiService.subscribeToDataService('uffici');
        this.fascicoli$ = this.apiService.subscribeToDataService('fascicoli');
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
                this.apiService.getById('titolari', this.id)
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
                            this.error = error; console.log(error);
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
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;
        }
    }

    public editFascicoliId(id: number) {
        this.router.navigate(['/app/fascicoli/edit/' + id]);
    }

    //todo: this should be in apiService but couldn't find yet how to call injected classes methods from templates
    public amministrazioniEnum(val:string):string {

        let e = this.apiService.dataEnum['amministrazioni'];
        if (-1 != String(val).indexOf(',') ) {
            let ret = [];
            String(val).split(',').forEach( item => {
                ret.push(e[item]['denominazione']);
            });
            return ret.join(', ');

        } else if (val) {

            return e[val] ? e[val]['denominazione'] : '';
        }
    }

    select2Changed(e: any, name: string): void {
        this.model[name] = typeof e.value === 'object' ? e.value.join(',') : Number(e.value);
    }
}
