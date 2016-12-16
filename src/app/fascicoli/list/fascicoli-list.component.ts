import { Component }        from '@angular/core';

import { Fascicoli } from '../../_models/index';
import { FascicoliService } from '../../_services/index';

@Component({
    templateUrl: 'fascicoli-list.component.html'
})
export class FascicoliListComponent {

    deletingFascicoli: Fascicoli = new Fascicoli;
    fascicoli: Fascicoli[] = [];

    constructor(private fascicoliService: FascicoliService) {
    }

    ngOnInit() {
        this.loadAllFascicoli();
    }

    askDeleteFascicoli(modal:any, fascicoli:Fascicoli ) {
        this.deletingFascicoli = fascicoli;
        modal.open();
    }

    confirmDeleteFascicoli(modal:any) {
        modal.close();
        this.deleteFascicoli(this.deletingFascicoli.id);
        this.deletingFascicoli = new Fascicoli;
    }

    deleteFascicoli(id: number) {
        this.fascicoliService.delete(id).subscribe(() => { this.loadAllFascicoli() });
    }

    private loadAllFascicoli() {
        this.fascicoliService.getAll().subscribe(fascicoli => { this.fascicoli = fascicoli; });
    }
}
