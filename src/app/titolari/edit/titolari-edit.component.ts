import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';


import { Fascicoli } from '../../_models/index';


import { APICommonService } from '../../_services/index';

@Component({
    templateUrl: 'titolari-edit.component.html'
})

export class TitolariEditComponent implements OnInit {

    public model: any = {};
    private error = '';
    public mode: string;
    private loading= true;
    private id: number;

    private filteredCount = {count: 0};
    private fascicoli$: Observable<Fascicoli[]>;

    constructor(private router: Router,
                private route: ActivatedRoute,
                public apiService: APICommonService
    ) {
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
}
