import { Component, OnInit, OnDestroy, ViewEncapsulation, Injector } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { __platform_browser_private__ } from '@angular/platform-browser'; // needed for select2 styles override hack

import { Titolari, Fascicoli } from '../../_models/index';
import { TitolariService, FascicoliService } from '../../_services/index';

@Component({
    templateUrl: 'register-edit.component.html',
    encapsulation: ViewEncapsulation.None
})
export class RegisterCreateComponent implements OnInit, OnDestroy {

    injector: Injector;
    domSharedStylesHost: any;
    selected: any;
    titolari: Titolari[] = [];
    titolariSelect: Select2OptionData[] = [];
    fascicoli: Fascicoli[] = [];
    fascicoliSelect: Select2OptionData[] = [];

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

    private myDatePickerNormalOptions = {
        dayLabels: {su: 'Dom', mo: 'Lun', tu: 'Mar', we: 'Mer', th: 'Gio', fr: 'Ven', sa: 'Sab'},
        monthLabels: { 1: 'Gen', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'Mag', 6: 'Giu', 7: 'Lug', 8: 'Ago', 9: 'Set', 10: 'Ott', 11: 'Nov', 12: 'Dic' },
        todayBtnTxt: 'Oggi',
        dateFormat: 'dd/mm/yyyy',
        firstDayOfWeek: 'mo',
        sunHighlight: true,
        showCurrentDay: true,
        height: '34px',
        selectionTxtFontSize: '14px',
        alignSelectorRight: false,
        indicateInvalidDate: true,
        showDateFormatPlaceholder: true,
        editableMonthAndYear: true,
        minYear: 1900,
        componentDisabled: false
    };

    private selectedDateNormal:string = '';
    private selectedTextNormal: string = '';
    private border: string = 'none';

    onDateChanged(event:any) {
        console.log('onDateChanged(): ', event.date, ' - jsdate: ', new Date(event.jsdate).toLocaleDateString(), ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
        if(event.formatted !== '') {
            this.selectedTextNormal = 'Formatted: ' + event.formatted + ' - epoc timestamp: ' + event.epoc;
            this.border = '1px solid #CCC';

            this.selectedDateNormal = event.formatted;
        }
        else {
            this.selectedTextNormal = '';
            this.border = 'none';
        }
    }

    onInputFieldChanged(event:any) {
        console.log('onInputFieldChanged(): Value: ', event.value, ' - dateFormat: ', event.dateFormat, ' - valid: ', event.valid);
    }

    onCalendarViewChanged(event:any) {
        this.border = '1px solid #66afe9';
        console.log('onCalendarViewChanged(): Year: ', event.year, ' - month: ', event.month, ' - first: ', event.first, ' - last: ', event.last);
    }

    getCopyOfOptions() {
        return JSON.parse(JSON.stringify(this.myDatePickerNormalOptions));
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
