import {Component, OnInit, OnDestroy, ViewEncapsulation, Injector} from '@angular/core';
import {Select2OptionData} from 'ng2-select2';
import {__platform_browser_private__} from '@angular/platform-browser'; // needed for select2 styles override hack

import {Titolari, Fascicoli, Amministrazione} from '../../_models/index';
import {APICommonService} from '../../_services/index';
import {AppConfig} from '../../app.config';


@Component({
    templateUrl: 'registri-edit.component.html',
    encapsulation: ViewEncapsulation.None
})
export class RegistriEditComponent implements OnInit, OnDestroy {

    model: any;
    config: any;
    injector: Injector;
    domSharedStylesHost: any;
    selected: any;
    titolari: Titolari[] = [];
    titolariSelect: Select2OptionData[] = [];
    fascicoli: Fascicoli[] = [];
    fascicoliSelect: Select2OptionData[] = [];
    amministrazione: Amministrazione[] = [];
    amministrazioneSelect: Select2OptionData[] = [];
    date: Date = new Date(2016, 5, 10);
    query: any;

    public select2Options: Select2Options;

    constructor(injector: Injector, private apiService: APICommonService, config: AppConfig) {

        this.select2Options = config.select2Options;

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
        };
    }

    ngOnInit() {

        this.apiService.getAll('titolari').subscribe(titolari => {
            this.titolari = titolari;
            this.titolariSelect = titolari as Select2OptionData[];
            this.titolariSelect.forEach((entry) => {
                entry.text = entry['codice'] + ' - ' + entry['denominazione'] + ' - ' + entry['descrizione'];
                entry['id'] = entry['id'];
            });
            this.titolariSelect.unshift({id: '-1', text: 'Inizia a scrivere per selezionare...'});


        });

        this.apiService.getAll('fascicoli').subscribe(fascicoli => {
            this.fascicoli = fascicoli;
            this.fascicoliSelect = fascicoli as Select2OptionData[];
            this.fascicoliSelect.forEach((entry) => {
                entry['text'] = entry['numero_fascicolo'] + ' - ' + entry['argomento'];
                entry['id'] = entry['numero_fascicolo'];
            });
            this.fascicoliSelect.unshift({id: '-1', text: 'Inizia a scrivere per selezionare...'});

        });

        this.apiService.getAll('amministrazione').subscribe(amministrazione => {
            this.amministrazione = amministrazione;
            this.amministrazioneSelect = amministrazione as Select2OptionData[];
            this.amministrazioneSelect.forEach((entry) => {
                entry['text'] = entry['codice'] + ' - ' + entry['denominazione'];
                entry['id'] = entry['id'];
            });
            this.amministrazioneSelect.unshift({id: '-1', text: 'Inizia a scrivere per selezionare...'});

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

    getAmministrazione(): Select2OptionData[] {
        return this.amministrazioneSelect;
    }

    select2Changed(e: any): void {
        this.selected = e.value;
    }

}
