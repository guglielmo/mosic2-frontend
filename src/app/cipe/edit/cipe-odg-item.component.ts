import {Component, Input, Output, OnInit, EventEmitter} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs/Observable";

import * as _ from "lodash";

import {AppConfig} from "../../app.config";
import {APICommonService} from "../../_services/index";

import {Fascicoli, CipeOdg, Registri, Titolari, Uffici} from "../../_models/index";

@Component({
    selector: 'cipe-odg-item',
    templateUrl: './cipe-odg-item.component.html',
    styles: []
})
export class CipeOdgItemComponent implements OnInit {
    @Input() item: CipeOdg;
    @Input() viewtype: any;
    @Input() canEdit: boolean;
    @Input() canDelete: boolean;
    @Output() deleteitem:EventEmitter<number> = new EventEmitter();

    public isNew;
    public edit = false;

    private select2Options: Select2Options;
    private select2OptionsMulti: Select2Options;
    private select2Debounce = false;

    public titolari$: Observable<Titolari[]>;
    public fascicoli$: Observable<Fascicoli[]>;
    public registri$: Observable<Registri[]>;
    public uffici$: Observable<Uffici[]>;

    public odgItemForm: FormGroup;
    public hasErrors = false;


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

        this.odgItemForm = fb.group({
            id_titolari: [{value:'', disabled: true}, Validators.required],
            id_fascicoli: [{value:'', disabled: true}, Validators.required],
            id_registri: [{value:'', disabled: true}, Validators.required],
            id_uffici: [{value:'', disabled: true}, Validators.required],
            ordine: [{value:'', disabled: true}, Validators.required],
            denominazione: [{value:'', disabled: true}, Validators.required],
            risultanza: [{value:'', disabled: true}],
            annotazioni: [{value:'', disabled: true}]
        });

        this.odgItemForm.valueChanges.subscribe(data => {
            this.item.id_uffici = Array.isArray(this.item.id_uffici) ? this.item.id_uffici.join(',') : this.item.id_uffici;
            this.item = Object.assign(this.item, data);
        });

    }

    ngOnInit() {
        this.odgItemForm.patchValue(this.item);
        this.isNew = !_.isNumber(this.item.id);
        if(this.isNew) { this.edit = true; }
    }

    toggleEdit(FG: any){

        if (this.edit && !FG.valid) {
            this.hasErrors = true;
            console.log(FG);
        } else {
            this.edit = !this.edit;
        }

    }

    deleteOdg($event, id){
            this.deleteitem.emit(id);
    }

    toggleAllegato(item:any, allegato_id: number) {

        var idx = _.indexOf(item.allegati_esclusi, allegato_id);
        if(idx !== -1) {
            item.allegati_esclusi.splice(idx, 1);
        } else {
            item.allegati_esclusi.push(allegato_id);
        }
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

        if (this.select2Debounce) {
            console.log('debounce', name, e.value);
            this.select2Debounce = false;
            return;
        }

        switch(name) {
            case 'id_uffici':
                this.select2Debounce = true;
                item.id_uffici = Array.isArray(e.value) ? e.value.join(',') : e.value ;

                // todo: ng2-select2 doesn't implement formControl accessors, to overcome this, here we're using a shadow copy
                // todo: may be removed when https://github.com/NejcZdovc/ng2-select2/issues/13 will be fixed
                this.odgItemForm.controls['id_uffici'].setValue(e.value);

                break;
            case 'id_titolari':
                this.select2Debounce = true;
                item.id_fascicoli = null;
                item.id_registri = [];
                item.id_titolari = e.value;

                // todo: ng2-select2 doesn't implement formControl accessors...
                this.odgItemForm.controls['id_registri'].setValue([]);
                this.odgItemForm.controls['id_titolari'].setValue(e.value);
                break;
            case 'id_fascicoli':
                this.select2Debounce = true;
                item.id_registri = [];
                item.id_fascicoli = e.value;

                // todo: ng2-select2 doesn't implement formControl accessors...
                this.odgItemForm.controls['id_registri'].setValue([]);
                this.odgItemForm.controls['id_fascicoli'].setValue(e.value);
                break;
            case 'id_registri':

                const selected_registri = this.castToArray(e.value);

                if (selected_registri.length === 0) {
                    item.allegati = {};
                    item.id_registri = selected_registri;

                    // todo: ng2-select2 doesn't implement formControl accessors...
                    this.odgItemForm.controls['id_registri'].setValue(selected_registri);
                }

                if(item.allegati[e.value]) {
                    item.id_registri = selected_registri;

                    // todo: ng2-select2 doesn't implement formControl accessors...
                    this.odgItemForm.controls['id_registri'].setValue(selected_registri);
                    //console.log('allegato found');
                } else {
                    this.getAllegatiRegistri(item, selected_registri);
                    console.log('no allegato found');
                }
                break;
        }
        //console.log(name, e.value, item, this.odgItemForm);
        console.log(name, e.value);
    }

    getAllegatiRegistri(item, id_registri: number[]) {

        id_registri.forEach( id => {
            console.log('checking id', id);
            if(id && !item.allegati[id] || item.allegati[id].length === 0) {
                this.apiService.getById('registri', id)
                    .subscribe( response => {
                            if(response && response.data && Array.isArray(response.data.allegati)) {
                                console.log('LOADED ALLEGATI', response.data.allegati);

                                console.log(item.allegati);

                                item.allegati[id] = _.compact(response.data.allegati);

                                console.log(item.allegati);
                                /*
                                 console.log(item.id_registri, id, item.id_registri.indexOf(id));
                                 */
                                if(item.id_registri.indexOf(id) === -1) {
                                    item.id_registri.push(Number(id));
                                }

                                // todo: ng2-select2 doesn't implement formControl accessors...
                                this.odgItemForm.controls['id_registri'].setValue(item.id_registri);
                            } else {
                                console.log('struttura allegati non valida', response);
                            }

                        },
                        error => {
                            //this.error = error; console.log(error);
                            //this.loading = false;
                        });
            }

        });

    }

/*    getAllAllegatiRegistri() {

        // not used now, cut 'n paste from parent component, eventually a refactoring is needed

        const id_registri = _.flatten(_.map(this.model.precipe_odg, 'id_registri'));

        id_registri.forEach( id => {
            this.allegati[id] = {};
            this.allegati$[id] = <BehaviorSubject<any[]>> new BehaviorSubject([]);

            this.apiService.getById('registri', id)
                .subscribe( response => {
                        this.allegati[id] = _.map(response.data.allegati, o => _.extend({escluso: false}, o));
                        this.allegati$[id].next(this.allegati[id]);
                    },
                    error => {
                        this.error = error; console.log(error);
                        this.loading = false;
                    });
        });
    }*/

}
