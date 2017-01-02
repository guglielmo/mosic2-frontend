import { Component }        from '@angular/core';

import { Fascicoli, Titolari } from '../../_models/index';
import { APICommonService } from '../../_services/index';

@Component({
    templateUrl: 'fascicoli-list.component.html'
})
export class FascicoliListComponent {

    deletingFascicoli: Fascicoli = new Fascicoli;
    fascicoli: Fascicoli[] = [];

    constructor(private apiService: APICommonService) {
    }

    ngOnInit() {
    }

    askDeleteFascicoli(modal:any, fascicoli:Fascicoli ) {
        this.deletingFascicoli = fascicoli;
        modal.open();
    }

    confirmDeleteFascicoli(modal:any) {
        modal.close();
        this.deleteFascicoli(this.deletingFascicoli.numero_fascicolo);
        this.deletingFascicoli = new Fascicoli;
    }

    deleteFascicoli(id: number) {
        this.apiService.delete('fascicoli', id).subscribe(() => {  });
    }
}
