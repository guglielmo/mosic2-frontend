import { Component }        from '@angular/core';

import { Titolari } from '../../_models/index';
import { TitolariService } from '../../_services/index';

@Component({
    templateUrl: 'titolari-list.component.html'
})
export class TitolariListComponent {

    deletingTitolari: Titolari = new Titolari;
    titolari: Titolari[] = [];

    constructor(private titolariService: TitolariService) {
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
        this.titolariService.delete(id).subscribe(() => { this.loadAllTitolari() });
    }

    private loadAllTitolari() {
        this.titolariService.getAll().subscribe(titolari => { this.titolari = titolari; });
    }
}
