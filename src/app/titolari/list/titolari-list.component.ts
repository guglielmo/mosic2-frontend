import { Component }        from '@angular/core';

import { Titolari } from '../../_models/index';
import { APICommonService } from '../../_services/index';

@Component({
    templateUrl: 'titolari-list.component.html'
})
export class TitolariListComponent {

    deletingTitolari: Titolari = new Titolari;
    titolari: Titolari[] = [];

    constructor(private apiService: APICommonService) {
    }

    ngOnInit() {
        this.loadAllTitolari();
    }

    askDeleteTitolari(modal:any, titolari:Titolari ) {
        this.deletingTitolari = titolari;
        modal.open();
    }

    confirmDeleteTitolari(modal:any) {
        modal.close();
        this.deleteTitolari(this.deletingTitolari.id);
        this.deletingTitolari = new Titolari;
    }

    deleteTitolari(id: number) {
        this.apiService.delete('titolari', id).subscribe(() => { this.loadAllTitolari() });
    }

    private loadAllTitolari() {
        this.apiService.getAll('titolari').subscribe(titolari => { this.titolari = titolari; });
    }
}
