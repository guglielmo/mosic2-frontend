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
            { id: 1, text:'NO CORTE DEI CONTI'},
            { id: 2, text:'PER CONOSCENZA'},
            { id: 3, text:'RICUSATO VISTO'},
            { id: 4, text:'RESTITUITA'},
            { id: 5, text:'RITIRATA'},
            { id: 6, text:'SUCCESSIVO'}
    ];

    public firmatari$: Observable<Firmatari[]>;

    public select2Options: Select2Options;
    public select2OptionsMulti: Select2Options;

    constructor(config: AppConfig,
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
