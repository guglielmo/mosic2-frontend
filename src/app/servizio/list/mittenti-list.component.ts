import {Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { URLSearchParams } from '@angular/http';


import {Mittenti} from '../../_models/index';
import {APICommonService} from '../../_services/index';


@Component({
    templateUrl: 'mittenti-list.component.html'
})
export class MittentiListComponent implements OnInit {

    public filter = {
        denominazione: ''
    };

    deletingMittenti: Mittenti = new Mittenti;
    public mittenti$: Observable<Mittenti[]>;
    filteredCount = {count: 0};

    constructor(public apiService: APICommonService,
                private router: Router
    ) {
        this.mittenti$ = this.apiService.subscribeToDataService('mittenti');
    }

    ngOnInit() {
        this.apiService.refreshCommonCache();
    }

    editId(id: number) {
        this.router.navigate(['/app/mittenti/edit/' + id]);
    }

    askDeleteMittenti(event:any, modal: any, mittenti: Mittenti) {
        event.stopPropagation();
        this.deletingMittenti = mittenti;
        modal.open();
    }

    confirmDeleteMittenti(modal: any) {
        modal.close();
        this.deleteMittenti(this.deletingMittenti.id);
        this.deletingMittenti = new Mittenti;
    }

    deleteMittenti(id: number) {
        this.apiService.delete('mittenti', id).subscribe(
            response => {
                this.apiService.refreshCommonCache();

            },
            error => { }
        );
    }

    public resetFilters(): void {
        this.filter = {
            denominazione: ''
        };
    }
}
