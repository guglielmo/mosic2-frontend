import {Component, OnInit, OnDestroy, ViewEncapsulation, Injector} from '@angular/core';
//import {__platform_browser_private__} from '@angular/platform-browser'; // needed for select2 styles override hack

import {Titolari, Fascicoli, Amministrazione, Mittente} from '../../_models/index';
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
    fascicoli: Fascicoli[] = [];
    amministrazione: Amministrazione[] = [];
    mittente: Mittente[] = [];
    date: Date = new Date(2016, 5, 10);
    query: any;

    public select2Options: Select2Options;
    public select2OptionsMulti: Select2Options;

    constructor(injector: Injector, private apiService: APICommonService, config: AppConfig) {

        this.select2Options = config.select2Options;
        this.select2OptionsMulti = Object.assign({}, config.select2Options);
        this.select2OptionsMulti['multiple'] = true;

        //
        // This is a hack on angular style loader to prevent ng2-select2 from adding its styles.
        // They are hard-coded into the component, so there are no other way to get rid of them
        //
/*        this.domSharedStylesHost = injector.get(__platform_browser_private__.DomSharedStylesHost);
        this.domSharedStylesHost.__onStylesAdded__ = this.domSharedStylesHost.onStylesAdded;
        this.domSharedStylesHost.onStylesAdded = (additions) => {
            const style = additions[0];
            if (!style || !style.trim().startsWith(".select2-container")) {
                this.domSharedStylesHost.__onStylesAdded__(additions);
            }
        };*/
    }

    ngOnInit() {

    }

    ngOnDestroy(): void {
        // detach custom hook
        //this.domSharedStylesHost.onStylesAdded = this.domSharedStylesHost.__onStylesAdded__;
    }

    select2Changed(e: any): void {
        this.selected = e.value;
    }

    onUploadSuccess(e: any): void {
        console.log(e);
    }

    onUploadError(e: any): void {

    }

}
