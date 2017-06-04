import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { URLSearchParams } from '@angular/http';


import { Firmatari } from '../../_models/index';
import { APICommonService } from '../../_services/index';


@Component({
    templateUrl: 'firmatari-list.component.html'
})
export class FirmatariListComponent implements OnInit {

    public filter = {
        denominazione_estesa: ''
    };

    deletingFirmatari: Firmatari = new Firmatari;
    public firmatari$: Observable<Firmatari[]>;
    filteredCount = {count: 0};

    constructor(public apiService: APICommonService,
                private router: Router
    ) {
        this.firmatari$ = this.apiService.subscribeToDataService('firmatari');
    }

    ngOnInit() {
        this.apiService.refreshCommonCache();
    }

    editId(id: number) {
        this.router.navigate(['/app/firmatari/edit/' + id]);
    }

    askDeleteFirmatari(event:any, modal: any, firmatari: Firmatari) {
        event.stopPropagation();
        this.deletingFirmatari = firmatari;
        modal.open();
    }

    confirmDeleteFirmatari(modal: any) {
        modal.close();
        this.deleteFirmatari(this.deletingFirmatari.id);
        this.deletingFirmatari = new Firmatari;
    }

    deleteFirmatari(id: number) {
        this.apiService.delete('firmatari', id).subscribe(
            response => {
                this.apiService.refreshCommonCache();

            },
            error => { }
        );
    }

    public resetFilters(event): void {
        event.stopPropagation();
        this.filter = {
            denominazione_estesa: ''
        };
    }
}
