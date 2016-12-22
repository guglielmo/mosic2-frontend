import { Component }        from '@angular/core';

import { Registri } from '../../_models/index';
import { RegistriService } from '../../_services/index';


@Component({
    templateUrl: 'registri-list.component.html'
})
export class RegistriListComponent {

    deletingRegistri: Registri = new Registri;
    registri: Registri[] = [];



    constructor(private registriService: RegistriService) {
    }

    ngOnInit() {
        this.loadAllRegistri();
    }

    askDeleteRegistri( modal:any, registri:Registri ) {
        this.deletingRegistri = registri;
        modal.open();
    }

    confirmDeleteRegistri(modal:any) {
        modal.close();
        this.deleteRegistri(this.deletingRegistri.id);
        this.deletingRegistri = new Registri;
    }

    deleteRegistri(id: number) {
        this.registriService.delete(id).subscribe(() => { this.loadAllRegistri() });
    }

    private loadAllRegistri() {
        this.registriService.getAll().subscribe(registri => { this.registri = registri; });
    }
}
