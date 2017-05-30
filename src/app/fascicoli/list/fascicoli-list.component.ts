import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';


import { APICommonService } from '../../_services/index';
import { AppConfig } from '../../app.config';

import { Amministrazioni } from '../../_models/amministrazioni';
import { Titolari } from '../../_models/titolari';
import { Fascicoli } from '../../_models/fascicoli';
import { Tags } from '../../_models/tags';


@Component({
    templateUrl: 'fascicoli-list.component.html'
})
export class FascicoliListComponent implements OnInit {

    public filter = {
        argomento: '',
        id_titolari: null,
        id_amministrazioni: null,
        numero_fascicolo: '',
        id_tags: null
    };
    public deletingFascicoli: Fascicoli = new Fascicoli;
    public fascicoli: Observable<Fascicoli[]>;
    public filteredCount = {count: 0};
    public select2Options: Select2Options;

    public titolari$: Observable<Titolari[]>;
    public fascicoli$: Observable<Fascicoli[]>;
    public amministrazioni$: Observable<Amministrazioni[]>;
    public tags$: Observable<Tags[]>;

    constructor(public apiService: APICommonService,
                private router: Router,
                private config: AppConfig
    ) {

        this.select2Options = config.select2Options;

        this.titolari$ = this.apiService.subscribeToDataService('titolari');
        this.fascicoli$ = this.apiService.subscribeToDataService('fascicoli');
        this.amministrazioni$ = this.apiService.subscribeToDataService('amministrazioni');
        this.tags$ = this.apiService.subscribeToDataService('tags');
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
            // this.loadAllFascicoli()
        });
    }

    private loadAllFascicoli() {
        this.apiService.getAll('fascicoli').subscribe(response => {
            this.fascicoli = Object.assign([], response.data);
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
            numero_fascicolo: '',
            id_tags: null
        };
    }

    // todo: this should be in apiService but couldn't find yet how to call injected classes methods from templates
    public amministrazioniEnum(val: string): string {

        const e = this.apiService.dataEnum['amministrazioni'];
        if (-1 !== String(val).indexOf(',') ) {
            const ret = [];
            String(val).split(',').forEach( item => {
                ret.push(e[item]['denominazione']);
            });
            return ret.join(', ');

        } else if (val) {

            return e[val] ? e[val]['denominazione'] : '';
        }
    }
}
