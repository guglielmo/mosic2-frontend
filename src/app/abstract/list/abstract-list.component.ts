import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import {AppConfig} from '../../app.config';
import {APICommonService} from '../../_services/index';
declare const jQuery: any;


@Component({
    templateUrl: 'abstract-list.component.html'
})
export class AbstractListComponent implements OnInit, OnDestroy {

    apipath: string;
    data_dependencies: string[];
    columns: any[];

    private _TPLModel = {
        apipath: '',
        labels: ['', ''],
        intro: '',
        new_label: '',
        editable: true,
        sort_by: 'codice',
        sort_order: 'asc',
        hide_search: false,
        columns: {}
    };
    public TPLModel = null;

    supportedAPIPaths = [];

    public filter = {
        text: ''
    };

    public loading = true;
    public deleting: any = null;
    public data$: Observable<any[]>;
    public filteredCount = {count: 0};

    private routeCheck: any;

    constructor(private router: Router,
                private route: ActivatedRoute,
                public apiService: APICommonService,
                public config: AppConfig
    ) {
        this.supportedAPIPaths = config.supportedAPIPaths;
        this.apipath = this.route.snapshot.params['apipath'];

        this.routeCheck = this.router.events.subscribe((event) => {

            if (event instanceof NavigationEnd) {

                this.apipath = this.route.snapshot.params['apipath'];
                const pathID = this.config.isPathSupported(event.url);
                // console.log('PATH CHANGE!', this.apipath, pathID);

                if ( pathID !== -1 ) {
                    this.switchPath(pathID);
                }
            }
        });
    }

    ngOnInit() {


    }

    ngOnDestroy() {
        this.routeCheck.unsubscribe();
    }

    private switchPath(pathID: number) {

        // console.log('ABSTRACT->', this.apipath);

        this.data_dependencies = [];
        this.TPLModel = $.extend(true, {}, this._TPLModel, this.config.supportedAPIPaths[pathID] );
        this.columns = this.config.supportedAPIPaths[pathID].columns;
        this.subscribeDataDependencies(this.columns);
        // console.log('template', this.TPLModel);

        this.data$ = this.apiService.subscribeToDataService(this.apipath);
        this.apiService.addCachedApiDataMethods(this.apipath);
        this.loading = false;
        this.apiService.refreshCommonCache();
    }

    private subscribeDataDependencies(columns: any[]) {
        columns.forEach( col => {
            if ( col.rel ) {
                this.data_dependencies.push(col.rel);
                this.apiService.addCachedApiDataMethods(col.rel);
            }
        });
        // console.log('data_dependencies', this.data_dependencies);
    }

    editId(id: number) {
        this.router.navigate(['/app/' + this.apipath + '/edit/' + id]);
    }

    askDelete(event: any, modal: any, item: any) {
        event.stopPropagation();
        this.deleting = item;
        modal.open();
    }

    confirmDelete(modal: any) {
        modal.close();
        this.doDelete(this.deleting.id);
        this.deleting = null;
    }

    doDelete(id: number) {
        this.apiService.delete(this.apipath, id).subscribe(
            response => {
                this.apiService.refreshCommonCache();

            },
            error => { }
        );
    }

    public resetFilters(): void {
        this.filter = {
            text: ''
        };
    }
}
