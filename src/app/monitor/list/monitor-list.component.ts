import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { URLSearchParams } from '@angular/http';


import { Cipe } from '../../_models/cipe';
import { APICommonService } from '../../_services/index';

import * as _ from 'lodash';


@Component({
    templateUrl: 'monitor-list.component.html'
})
export class MonitorListComponent implements OnInit {

    public model: any = [];

    public mode: string = 'group';

    public today = new Date().getTime();
    public firstYear = 2007;
    public currentYear: number = Number(new Date().getFullYear());
    public years: number[] = [];

    public viewtype: string = 'situazione';
    public dateFilter: string = '';

    public filter = {
        anno: this.currentYear,
        data_cipe: ''
    };

    public cipe$: Observable<Cipe[]>;

    filteredCount = {count: 0};

    constructor(public apiService: APICommonService,
                private router: Router,
                private route: ActivatedRoute,
    ) {

        this.cipe$ = this.apiService.subscribeToDataService('cipe');

        for (let i = this.currentYear; i >= this.firstYear; i--) {
            this.years.push(i);
        }

        this.router.events
            .subscribe((event) => {
                if (event instanceof NavigationEnd && event.url.indexOf('monitor') != -1) {

                    this.viewtype = this.route.snapshot.params['viewtype'];
                    this.dateFilter = this.route.snapshot.params['dateFilter'];

                    if (this.dateFilter && this.dateFilter.length === 4) {

                        this.mode = 'group';
                        this.filter.anno = Number(this.dateFilter);
                        this.onYearChanged(this.dateFilter);

                    } else if (this.dateFilter && this.dateFilter.length === 10) {

                        this.mode = 'detail';
                        let year = new Date(this.dateFilter).getFullYear();
                        this.filter.anno = year;
                        this.filter.data_cipe = this.dateFilter;
                        this.onDataCipeChanged(this.dateFilter)

                    } else {

                        this.mode = 'group';
                        this.onYearChanged(this.currentYear);
                    }
                }
            });
    }

    ngOnInit() {
        this.apiService.refreshCommonCache();

        this.loadYear(this.currentYear);

    }

    editId(id: number) {
        this.router.navigate(['/app/tags/edit/' + id]);
    }

    loadYear(year: number) {
        this.apiService.getById('monitor/group', year)
            .subscribe(
                response => {
                    //console.log(response);
                    if(response.data) {
                        this.model = response.data;
                    }
                },
                error => {
                    console.log(error);
                }
            )
    }

    loadCipe(date) {
        this.apiService.getById('monitor', date)
            .subscribe(
                response => {
                    //console.log(response);
                    if(response.data) {
                        this.model = response.data;
                    }
                },
                error => {
                    console.log(error);
                }
            )
    }

    public resetFilters(): void {
        this.filter = {
            anno: null,
            data_cipe: ''
        };
    }

    public onYearChanged(year) {
        this.filter.anno = year;
        this.router.navigate(['/app/monitor/'+this.viewtype+'/'+year]);
        this.loadYear(year);
    }

    public onDataCipeChanged(date) {
        this.router.navigate(['/app/monitor/'+this.viewtype+'/'+date]);
        this.loadCipe(date);
    }

    public onViewTypeChange(type) {
        if (this.dateFilter) {
            this.router.navigate(['/app/monitor/'+this.viewtype+'/'+this.dateFilter]);

        } else {

            this.router.navigate(['/app/monitor/'+this.viewtype]);
        }
    }

    public sumSeries(viewtype: string, item: string) {
        return _.sumBy(this.model, function(o) { return o[viewtype][item]; });
    }
}
