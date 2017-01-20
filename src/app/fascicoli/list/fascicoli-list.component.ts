import { Component }        from '@angular/core';
import { Router } from '@angular/router';

import { Fascicoli } from '../../_models/index';
import { APICommonService } from '../../_services/index';
import { AppConfig } from '../../app.config';

@Component({
    templateUrl: 'fascicoli-list.component.html'
})
export class FascicoliListComponent {

    public filter = {
        argomento: '',
        id_titolari: -1,
        amministrazione: -1,
        numero_fascicolo: ''
    };
    public deletingFascicoli: Fascicoli = new Fascicoli;
    public fascicoli: Fascicoli[] = [];

    public select2Options: Select2Options;

    constructor(private apiService: APICommonService,
                private router: Router,
                private config: AppConfig
    ) {
        this.select2Options = config.select2Options;
    }

    ngOnInit() {
        this.loadAllFascicoli();
    }

    public editId(id: number) {
        this.router.navigate(['/app/fascicoli/edit/' + id]);
    }

    public askDeleteFascicoli(event: any, modal: any, fascicoli: Fascicoli) {
        event.stopPropagation();
        this.deletingFascicoli = fascicoli;
        modal.open();
    }

    public confirmDeleteFascicoli(modal: any) {
        modal.close();
        this.deleteFascicoli(this.deletingFascicoli.id);
        this.deletingFascicoli = new Fascicoli;
    }

    private deleteFascicoli(id: number) {
        this.apiService.delete('fascicoli', id).subscribe(() => {
            this.loadAllFascicoli()
        });
    }

    private loadAllFascicoli() {
        this.apiService.getAll('fascicoli').subscribe(response => {
            this.fascicoli = Object.assign([],response.data);
        });
    }

    public select2Changed(e: any, name: string): void {
        this.filter[name] = e.value;
    }
}
