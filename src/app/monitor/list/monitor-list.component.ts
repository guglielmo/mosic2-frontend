import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { URLSearchParams } from '@angular/http';


import { Tags } from '../../_models/index';
import { APICommonService } from '../../_services/index';


@Component({
    templateUrl: 'monitor-list.component.html'
})
export class MonitorListComponent implements OnInit {

    public model: any = [];

    public today = new Date().getTime();
    public firstYear = 1998;
    public currentYear: number = Number(new Date().getFullYear());
    public years: number[] = [];

    public filter = {
        anno: this.currentYear
    };

    deletingTags: Tags = new Tags;
    public tags$: Observable<Tags[]>;
    filteredCount = {count: 0};

    constructor(public apiService: APICommonService,
                private router: Router
    ) {
        for (let i = this.currentYear; i >= this.firstYear; i--) {
            this.years.push(i);
        }

        this.tags$ = this.apiService.subscribeToDataService('tags');
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
                    console.log(response);
                    if(response.data) {
                        this.model = response.data;
                    }
                },
                error => {
                    console.log(error);
                }
            )
    }

    askDeleteTags(event:any, modal: any, tags: Tags) {
        event.stopPropagation();
        this.deletingTags = tags;
        modal.open();
    }

    confirmDeleteTags(modal: any) {
        modal.close();
        this.deleteTags(this.deletingTags.id);
        this.deletingTags = new Tags;
    }

    deleteTags(id: number) {
        this.apiService.delete('tags', id).subscribe(
            response => {
                this.apiService.refreshCommonCache();

            },
            error => { }
        );
    }

    public resetFilters(): void {
        this.filter = {
            anno: null
        };
    }

    public onYearChanged(year) {

        this.filter.anno = year;
        this.loadYear(year);
    }
}
