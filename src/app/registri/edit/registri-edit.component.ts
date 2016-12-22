import { Component, OnInit, OnDestroy, ViewEncapsulation, Injector } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { __platform_browser_private__ } from '@angular/platform-browser'; // needed for select2 styles override hack

import { Titolari, Fascicoli } from '../../_models/index';
import { TitolariService, FascicoliService } from '../../_services/index';

@Component({
    templateUrl: 'registri-edit.component.html',
    encapsulation: ViewEncapsulation.None
})
export class RegistriEditComponent implements OnInit, OnDestroy {

    model: any;

    injector: Injector;
    domSharedStylesHost: any;
    selected: any;
    titolari: Titolari[] = [];
    titolariSelect: Select2OptionData[] = [];
    fascicoli: Fascicoli[] = [];
    fascicoliSelect: Select2OptionData[] = [];
    date: Date = new Date(2016, 5, 10);

    constructor(
        injector: Injector,
        private titolariService: TitolariService,
        private fascicoliService: FascicoliService
    ) {

        //
        // This is a hack on angular style loader to prevent ng2-select2 from adding its styles.
        // They are hard-coded into the component, so there are no other way to get rid of them
        //
        this.domSharedStylesHost = injector.get(__platform_browser_private__.DomSharedStylesHost);
        this.domSharedStylesHost.__onStylesAdded__ = this.domSharedStylesHost.onStylesAdded;
        this.domSharedStylesHost.onStylesAdded = (additions) => {
            const style = additions[0];
            if (!style || !style.trim().startsWith(".select2-container")) {
                this.domSharedStylesHost.__onStylesAdded__(additions);
            }
        }
    }

    ngOnInit() {
        this.titolariService.getAll().subscribe(titolari => {
            this.titolari = titolari;
            this.titolariSelect = titolari as Select2OptionData[];
            this.titolariSelect.forEach((entry) => {
               entry.text = entry['codice'] + ' - ' + entry['denominazione'] + ' - ' + entry['descrizione'];
            });

        });

        this.fascicoliService.getAll().subscribe(fascicoli => {
            let count = 0;
            this.fascicoli = fascicoli;
            this.fascicoliSelect = fascicoli as Select2OptionData[];
            this.fascicoliSelect.forEach((entry) => {
                entry['text'] = entry['numero_fascicolo'] + ' - ' + entry['argomento'];
                entry['id'] = String(count++);
            });

        });
    }

    ngOnDestroy(): void {
        // detach custom hook
        this.domSharedStylesHost.onStylesAdded = this.domSharedStylesHost.__onStylesAdded__;
    }

    getTitolari(): Select2OptionData[] {
        return this.titolariSelect;
    }

    getFascicoli(): Select2OptionData[] {
        return this.fascicoliSelect;
    }

    select2Changed(e: any): void {
        this.selected = e.value;
    }

}
