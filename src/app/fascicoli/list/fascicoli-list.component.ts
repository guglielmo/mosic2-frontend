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
        id_amministrazioni: -1,
        numero_fascicolo: ''
    };
    public deletingFascicoli: Fascicoli = new Fascicoli;
    public fascicoli: Fascicoli[] = [];
    public filteredCount = {count: 0};
    public select2Options: Select2Options;

    constructor(private apiService: APICommonService,
                private router: Router,
                private config: AppConfig
    ) {

        this.select2Options = config.select2Options;
    }

    ngOnInit() {
        this.apiService.refreshCommonCache();
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
            this.apiService.refreshCommonCache();
            //this.loadAllFascicoli()
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

    public resetFilters(): void {
        this.filter = {
            argomento: '',
            id_titolari: -1,
            id_amministrazioni: -1,
            numero_fascicolo: ''
        };
    }

    //todo: this should be in apiService but couldn't find yet how to call injected classes methods from templates
    public amministrazioniEnum(val:string):string {
    if (-1 != String(val).indexOf(',') ) {
        let ret = [];
        String(val).split(',').forEach( item => {
            ret.push(this.apiService._amministrazioniEnum[item]);
        });
        return ret.join(', ');

    } else if (val) {
        return this.apiService._amministrazioniEnum[val];
    }
}
}
