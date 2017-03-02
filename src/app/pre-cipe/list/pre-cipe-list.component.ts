import {Component}        from '@angular/core';
import {Router} from '@angular/router';
import { URLSearchParams } from '@angular/http';


import {Titolari} from '../../_models/index';
import {APICommonService} from '../../_services/index';

@Component({
    templateUrl: 'pre-cipe-list.component.html'
})
export class PreCipeListComponent {

    deletingTitolari: Titolari = new Titolari;
    titolari: Titolari[] = [];

    constructor(private apiService: APICommonService,
                private router: Router
    ) {
    }

    ngOnInit() {
        this.apiService.refreshCommonCache();
        //this.loadAllTitolari();
    }

    editId(id: number) {
        this.router.navigate(['/app/titolari/edit/' + id]);
    }

    askDeleteTitolari(event:any, modal: any, titolari: Titolari) {
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
            //this.loadAllTitolari()
        });
    }

    private loadAllTitolari() {
        let params = new URLSearchParams();
        params.append('sort_by', 'codice');
        params.append('sort_order', 'asc');

        this.apiService.getAll('titolari', params).subscribe(response => {
            this.titolari = response.data;
        });
    }
}
