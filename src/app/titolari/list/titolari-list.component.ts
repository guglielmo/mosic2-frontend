import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Titolari } from '../../_models/index';
import { APICommonService } from '../../_services/index';

@Component({
    templateUrl: 'titolari-list.component.html'
})
export class TitolariListComponent implements OnInit {

    deletingTitolari: Titolari = new Titolari;
    public titolari: Observable<Titolari[]>;

    constructor(public apiService: APICommonService,
                private router: Router
    ) {
        this.titolari = this.apiService.subscribeToDataService('titolari');
    }

    ngOnInit() {
        this.apiService.refreshCommonCache();
        // this.loadAllTitolari();
    }

    editId(id: number) {
        this.router.navigate(['/app/titolari/edit/' + id]);
    }

    askDeleteTitolari(event: any, modal: any, titolari: Titolari) {
        event.stopPropagation();
        this.deletingTitolari = titolari;
        modal.open();
    }

    confirmDeleteTitolari(modal: any) {
        modal.close();
        this.deleteTitolari(this.deletingTitolari.id);
        this.deletingTitolari = new Titolari;
    }

    deleteTitolari(id: number) {
        this.apiService.delete('titolari', id).subscribe(() => {
            this.apiService.refreshCommonCache();
            // this.loadAllTitolari()
        });
    }

    private loadAllTitolari() {
        const params = new URLSearchParams();
        params.append('sort_by', 'codice');
        params.append('sort_order', 'asc');

        this.apiService.getAll('titolari', params).subscribe(response => {
            this.titolari = response.data;
        });
    }
}
