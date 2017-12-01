import {Component, Input, OnInit} from "@angular/core";
import {AppConfig} from "../../app.config";
import {APICommonService} from "../../_services/index";
import {Observable} from "rxjs/Observable";

import {ScrollToService} from "ng2-scroll-to-el";


import {Firmatari} from "../../_models/firmatari";
import {RilieviCC} from "../../_models/rilievi_cc";


@Component({
    selector: 'delibere-iter',
    templateUrl: './delibere-iter.component.html'
})
export class DelibereIterComponent implements OnInit {
    @Input() model: any;
    @Input() allowUpload: boolean;
    @Input() canEdit: boolean;
    @Input() canDelete: boolean;

    public tipo_registrazione_cc = [
            { id: 1, text:'NO CORTE DEI CONTI'}, //NON C'E' BISOGNO DI MANDARLA ALLA C.C.
            { id: 2, text:'PER CONOSCENZA'}, // INVIO SOLO PER CONOSCENZA
            { id: 3, text:'RICUSATO VISTO'}, // ITER INTERROTTO DALLA CC DEFINITIVAMENTE
            { id: 4, text:'RESTITUITA'}, // ITER INTERROTTO CON POSSIBILITA' DI REVISIONE
            { id: 5, text:'RITIRATA'}, // ITER INTERROTTO DAL DIPE
            { id: 6, text:'SUCCESSIVO'} // INVIO ALLA C.C. PER VERIFICA, PUÒ ESSERE SUCCESSIVO ALLA PUBBLICAZIONE IN G.U.
    ];

    public firmatari$: Observable<Firmatari[]>;

    public select2Options: Select2Options;
    public select2OptionsMulti: Select2Options;

    constructor(public config: AppConfig,
                public apiService: APICommonService,
                private scrollService: ScrollToService) {
        this.select2Options = config.select2Options;
        this.select2OptionsMulti = config.select2OptionsMulti;
        this.firmatari$ = this.apiService.subscribeToDataService('firmatari');
    }

    createRilievo_CC($event?, element?) {
        if($event) {
            $event.preventDefault();
            $event.stopPropagation();
        }

        this.model.rilievi_CC.push(new RilieviCC());

        if(element) {
            this.scrollService.scrollTo(element, 1500);
        }
    }

    ngOnInit() {
    }

    public select2Changed(e: any, name: string): void {
        this.model[name] = e.value;
    }

}
