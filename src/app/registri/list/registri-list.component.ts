import { Component }        from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
//import { ChangeDetectionStrategy } from '@angular/core';



import { Registri } from '../../_models/index';
import { APICommonService } from '../../_services/index';
import { AppConfig } from '../../app.config';

import * as _ from "lodash";
import {Select2OptionData} from 'ng2-select2';


@Component({
    templateUrl: 'registri-list.component.html',
    //changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistriListComponent {

    public filter = {
        id: '',
        oggetto: '',
        id_titolari: -1,
        mittente: -1,
        protocollo_mittente: '',
        protocollo_arrivo: '',
        numero_fascicolo: -1,
        data_arrivo_da: '',
        data_arrivo_a: ''
    };
    deletingRegistri: Registri = new Registri;
    registri: Registri[] = [];

    public fascicoliSelect: Observable<Array<Select2OptionData>>;
    public fasc: Select2OptionData[];

    public select2Options: Select2Options;

    constructor(private apiService: APICommonService,
                private router: Router,
                private config: AppConfig
    ) {
        this.select2Options = config.select2Options;
    }

    ngOnInit() {
        this.loadAllRegistri();
    }

    askDeleteRegistri(event: any, modal: any, registri: Registri) {
        event.stopPropagation();
        this.deletingRegistri = registri;
        modal.open();
    }

    editId(id: number) {
        this.router.navigate(['/app/registri/edit/' + id]);
    }

    confirmDeleteRegistri(modal: any) {
        modal.close();
        this.deleteRegistri(this.deletingRegistri.id);
        this.deletingRegistri = new Registri;
    }

    deleteRegistri(id: number) {
        this.apiService.delete('registri', id).subscribe(() => {
            this.loadAllRegistri()
        });
    }

    private loadAllRegistri() {
        this.apiService.getAll('registri').subscribe(response => {
            this.registri = Object.assign([],response.data);

            /* moment(entry['data_arrivo'], "DD/MM/YYYY").format("YYYY-MM-DD"); */

        });
    }

    public getFascicoliByTitolario() {
        this.fascicoliSelect = Observable.of(this.apiService.fascicoliSelect);
        this.fasc = this.apiService.fascicoliSelect;
        return true;
    }

    public select2Changed(e: any, name: string): void {
        this.filter[name] = e.value;

/*        console.log(name);
        if(name == 'titolario') {

            let ret = _.filter(this.apiService.fascicoliSelect, row => {
                if (Number(e.value) != -1 && row.codice_titolario != Number(e.value)) return false;
                return true;
            });
            this.fascicoliSelect = Observable.of(ret);
            this.fasc = ret;
            this.filter.numero_fascicolo = -1;
        }*/
    }
}
