import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { URLSearchParams } from '@angular/http';


import {Uffici} from '../../_models/index';
import {APICommonService} from '../../_services/index';


@Component({
    templateUrl: 'uffici-list.component.html'
})
export class UfficiListComponent implements OnInit {

    public filter = {
        denominazione: ''
    };

    deletingUffici: Uffici = new Uffici;
    public uffici$: Observable<Uffici[]>;
    filteredCount = {count: 0};

    constructor(public apiService: APICommonService,
                private router: Router
    ) {
        this.uffici$ = this.apiService.subscribeToDataService('uffici');
    }

    ngOnInit() {
        this.apiService.refreshCommonCache();
    }

    editId(id: number) {
        this.router.navigate(['/app/uffici/edit/' + id]);
    }

    askDeleteUffici(event:any, modal: any, uffici: Uffici) {
        event.stopPropagation();
        this.deletingUffici = uffici;
        modal.open();
    }

    confirmDeleteUffici(modal: any) {
        modal.close();
        this.deleteUffici(this.deletingUffici.id);
        this.deletingUffici = new Uffici;
    }

    deleteUffici(id: number) {
        this.apiService.delete('uffici', id).subscribe(
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
