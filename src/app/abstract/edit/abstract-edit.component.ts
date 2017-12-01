import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AppConfig } from '../../app.config';
import { APICommonService } from '../../_services/index';
import { User } from '../../_models/user'

import * as _ from 'lodash';

@Component({
    templateUrl: 'abstract-edit.component.html'
})

export class AbstractEditComponent implements OnInit, AfterViewChecked {

    apipath: string;
    data_dependencies: string[] = [];
    data_dependencies$ = {};
    columns: any[];
    currentPathID: number;

    public TPLModel = {
        apipath: '',
        labels: ['', ''],
        intro: '',
        new_label: '',
        columns: {}
    };

    model: any = {};
    error = '';
    mode: string;
    loading= true;
    id: number;

    supportedAPIPaths = [];

    debounceSelect = 1;

    public users$: Observable<User[]>;

    constructor(private router: Router,
                private route: ActivatedRoute,
                public apiService: APICommonService,
                public config: AppConfig,
                private ref: ChangeDetectorRef
    ) {
        this.users$ = this.apiService.subscribeToDataService('users');
    }

    ngOnInit() {

        this.apiService.refreshCommonCache();

        this.id = +this.route.snapshot.params['id'];
        this.apipath = this.route.snapshot.params['apipath'];
        const pathID = this.config.isPathSupported(this.apipath);
        if ( pathID !== -1 ) {
            this.switchPath(pathID);
        }
        this.mode = isNaN(this.id) ? 'create' : 'update';

        switch ( this.mode ) {
            case 'create':
                this.columns.forEach(column => { this.model[column.field] = column.rel ? null : ''});
                this.loading = false;
                break;

            case 'update':
                this.apiService.getById(this.apipath, this.id)
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

        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                // console.log(event);
                this.apipath = this.route.snapshot.params['apipath'];
                const pathID = this.config.isPathSupported(event.url);
                if ( pathID !== -1 ) {
                    this.switchPath(pathID);
                }
            }
        });
    }

    ngAfterViewChecked(): void {
        this.ref.detectChanges();
    }

    public isValid(column: any) {

        if (column.required && !this.model[column.field]) {
            return false;
        }
        // if(this.model[field] === null || this.model[field] === '')

        return true;
    }

    private switchPath(pathID: number) {

        if ( pathID !== this.currentPathID ) {

            this.currentPathID = pathID;

            // console.log('pathID>>>>', pathID);

            this.TPLModel = this.config.supportedAPIPaths[pathID];
            this.columns = this.config.supportedAPIPaths[pathID].columns;
            this.subscribeDataDependencies(this.columns);
            this.apiService.refreshCommonCache();
        }
    }

    private subscribeDataDependencies(columns: any[]) {
        columns.forEach( col => {
           if ( col.rel ) {
               this.data_dependencies.push(col.rel);
               this.data_dependencies$[col.rel] = this.apiService.subscribeToDataService(col.rel);
           }
        });
    }

    cancel( event ) {
        this.router.navigate(['/app/' + this.apipath + '/list']);
    }

    submit() {

        let isValid = true;

        _.forEach(this.TPLModel.columns, column => {
            if (column.required && !this.model[column.field]) {
                isValid = false;
            }
        });

        if (isValid) {
            this.loading = true;

            switch ( this.mode ) {
                case 'create':
                    this.apiService.create(this.apipath, this.model)
                        .subscribe(
                            data => {
                                this.router.navigate(['/app/' + this.apipath + '/list']);
                            },
                            error => {
                                this.error = error; console.log(error);
                                this.loading = false;
                            });
                    break;

                case 'update':
                    this.apiService.update(this.apipath, this.model)
                        .subscribe(
                            data => {
                                this.router.navigate(['/app/' + this.apipath + '/list']);
                            },
                            error => {
                                this.error = error; console.log(error);
                                this.loading = false;
                            });
                    break;
            }
        }
    }

    select2Changed(e: any, name: string): void {

        // TODO: cleanup code when a fix is released for
        // https://github.com/NejcZdovc/ng2-select2/issues/68
        // https://github.com/NejcZdovc/ng2-select2/issues/61

        if (!this.debounceSelect) {
            this.debounceSelect = 1;
        } else {
            this.debounceSelect = 0;
            if (this.model[name] === Number(e.value)) {
                this.model[name] = null;
            } else {
                this.model[name] = Number(e.value);
            }
            // console.log(this.model[name]);
        }

/*        if (e.value !== null) {
            this.model[name] = typeof e.value === 'object' ? e.value.join(',') : Number(e.value);
        }*/
    }

    parseFilter(filter: any) {
        if (filter === 'only_referenti') {
            return filter;
        }

        if (typeof filter === 'string') {
            const f = {};
            f[filter] = Number(this.model[filter]);
            return f;
        } else {
            return filter;
        }
    }
}
