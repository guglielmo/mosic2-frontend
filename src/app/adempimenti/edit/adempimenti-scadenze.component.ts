import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AppConfig } from "../../app.config";
import { APICommonService } from "../../_services/index";
import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';



@Component({
    selector: '[adempimenti-scadenze]',
    templateUrl: './adempimenti-scadenze.component.html'
})
export class AdempimentiScadenzeComponent implements OnInit {
    @Input() model: any;
    @Input() canEdit: boolean;
    @Input() canDelete: boolean;
    @Output() deleteitem:EventEmitter<number> = new EventEmitter();

    public allowUpload = false;
    public select2Options: Select2Options;
    public select2OptionsMulti: Select2Options;

    public esitoSelect2 = [
        { id: 0, text: '', class: ''},
        { id: 1, text: 'Ottemperato', class: 'bg-ottemperato'},
        { id: 2, text: 'Superato per scadenza dei termini', class: 'bg-superato'}
    ];

    constructor(
        private router: Router,
        config: AppConfig,
        public apiService: APICommonService
    ) {
        this.select2Options = config.select2Options;
        this.select2OptionsMulti = config.select2OptionsMulti;
    }

    ngOnInit() {
        // instantiate every date
        _.forEach(this.model, (value, key) => {
            //console.log(value);
            if(key && key.indexOf('data') !== -1) {
                if(value) {
                    this.model[key] = new Date(value);
                }
            }
        });

        this.allowUpload = this.model.id > 0;
    }

    public select2Changed(e: any, name: string): void {
        this.model[name] = e.value;
    }

    public deleteScadenza(id) {
        this.apiService.delete('adempimenti_scadenze', id).subscribe(() => {
            // this.loadAllAdempimenti()
            this.deleteitem.emit(id);
            this.router.navigate(['/app/adempimenti/list']);
        });
    }

}
