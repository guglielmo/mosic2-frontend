import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms'
import { Observable } from 'rxjs/Observable';
import * as _ from "lodash";

import { AppConfig} from "../../app.config";
import { APICommonService} from "../../_services/index";

import { Titolari, Fascicoli, Registri, Uffici } from '../../_models/index';
import { PrecipeOdg } from "../../_models/index";

@Component({
    selector: 'precipe-odg-item',
    templateUrl: './precipe-odg-item.component.html',
    styles: []
})
export class PrecipeOdgItemComponent implements OnInit {
    @Input() item: PrecipeOdg;

    public edit = false;

    private select2Options: Select2Options;
    private select2OptionsMulti: Select2Options;
    private select2Debounce = false;

    public titolari$: Observable<Titolari[]>;
    public fascicoli$: Observable<Fascicoli[]>;
    public registri$: Observable<Registri[]>;
    public uffici$: Observable<Uffici[]>;

    odgItemForm: FormGroup;

    constructor(
                config: AppConfig,
                public apiService: APICommonService,
                fb: FormBuilder

    ) {
        this.select2Options = config.select2Options;
        this.select2OptionsMulti = config.select2OptionsMulti;

        this.titolari$ = this.apiService.subscribeToDataService('titolari');
        this.fascicoli$ = this.apiService.subscribeToDataService('fascicoli');
        this.registri$ = this.apiService.subscribeToDataService('registri');
        this.uffici$ = this.apiService.subscribeToDataService('uffici');

        this.odgItemForm = fb.group({});
    }

    ngOnInit() {
    }

    toggleEdit(value: any){
        console.log(value);
        this.edit = !this.edit;
    }

    allegatoIsChecked(item: any, allegatoId: number) {

        return !(item.allegati_esclusi.indexOf(allegatoId) !== -1);

    }

    allegatiStatus(item: any) {

        const id_registri = this.castToArray(item.id_registri);

        // check if no registri are selected
        if (id_registri.length === 0) {
            return 'noregistri';
        }

        // check if any selected registri has zero allegati
        let checkMissing = false;
        id_registri.forEach(id_registro => {
            if (item.allegati[id_registro].length === 0) {
                checkMissing = true;
                return;
            }
        });
        if (checkMissing) {
            return 'missing';
        }

        // check if no allegati are excluded
        if (this.castToArray(item.allegati_esclusi).length === 0) {
            return 'success';
        }

        // check if excluded allegati are not approved yet
        if (_.isEqual(item.allegati_esclusi, item.allegati_esclusi_approvati)) {
            return 'warning';
        }

        return 'danger';

    }

    castToArray(item) {
        return item ? _.castArray(item) : [];
    }

    public select2Changed(e: any, item: any, name: string): void {

        /*        if (this.select2Debounce) {
         console.log('debounce', name, e.value);
         this.select2Debounce = false;
         return;
         }*/

        console.log(name, e.value);

        switch(name) {
            case 'id_titolari':
                this.select2Debounce = true;
                item.id_fascicoli = null;
                item.id_registri = [];
                item.id_titolari = e.value;
                break;
            case 'id_fascicoli':
                this.select2Debounce = true;
                item.id_registri = [];
                item.id_fascicoli = e.value;
                break;
            case 'id_registri':
                this.select2Debounce = true;

                const selected_registri = this.castToArray(e.value);

                if (selected_registri.length === 0) {
                    item.allegati = [];
                    item.id_registri = selected_registri;
                }

                if(item.allegati[e.value]) {
                    item.id_registri = selected_registri;
                    //console.log('allegato found');
                } else {
                    this.getAllegatiRegistri(item, selected_registri);
                    //console.log('no allegato found');
                }
                break;
        }

        //console.log(item);
    }

    getAllegatiRegistri(item, id_registri: number[]) {

        id_registri.forEach( id => {

            if(!item.allegati[id] || item.allegati[id].length === 0) {
                this.apiService.getById('registri', id)
                    .subscribe( response => {
                            item.allegati[id] = response.data.allegati;
                            if(item.id_registri.indexOf(id) === -1) {
                                item.id_registri.push(id);
                            }
                            console.log(item);
                            //this._allegati[id] = _.map(response.data.allegati, o => _.extend({escluso: false}, o));
                            //this._allegati$[id].next(this._allegati[id]);
                        },
                        error => {
                            //this.error = error; console.log(error);
                            //this.loading = false;
                        });
            }

        });

    }

}
