import { Component }        from '@angular/core';
import { Router } from '@angular/router';

import { Fascicoli, Titolari } from '../../_models/index';
import { APICommonService } from '../../_services/index';
import { AppConfig } from '../../app.config';

@Component({
    templateUrl: 'fascicoli-list.component.html'
})
export class FascicoliListComponent {

    public filterQuery = "";
    deletingFascicoli: Fascicoli = new Fascicoli;
    fascicoli: Fascicoli[] = [];

    public select2Options: Select2Options;

    constructor(private apiService: APICommonService,
                private router: Router,
                private config: AppConfig
    ) {
        this.select2Options = config.select2Options;
    }

    ngOnInit() {
    }

    editId(id: number) {
        this.router.navigate(['/app/fascicoli/edit/' + id]);
    }

    askDeleteFascicoli(modal: any, fascicoli: Fascicoli) {
        this.deletingFascicoli = fascicoli;
        modal.open();
    }

    confirmDeleteFascicoli(modal: any) {
        modal.close();
        this.deleteFascicoli(this.deletingFascicoli.numero_fascicolo);
        this.deletingFascicoli = new Fascicoli;
    }

    deleteFascicoli(id: number) {
        this.apiService.delete('fascicoli', id).subscribe(() => {
        });
    }
}
