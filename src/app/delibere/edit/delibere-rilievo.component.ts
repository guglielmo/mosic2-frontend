import { Component, Input, Output, OnInit } from '@angular/core';
import { AppConfig } from "../../app.config";
import { APICommonService } from "../../_services/index";
import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';



import { Firmatari } from '../../_models/index';


@Component({
    selector: 'delibere-rilievo',
    templateUrl: './delibere-rilievo.component.html'
})
export class DelibereRilievoComponent implements OnInit {
    @Input() model: any;

    public select2Options: Select2Options;
    public select2OptionsMulti: Select2Options;

    constructor(
        config: AppConfig,
        public apiService: APICommonService
    ) {
        this.select2Options = config.select2Options;
        this.select2OptionsMulti = config.select2OptionsMulti;

    }

    ngOnInit() {
        // instantiate every date
        _.forEach(this.model, (value, key) => {
            if(key && key.indexOf('data') !== -1) {
                if(value) {
                    this.model[key] = new Date(value);
                }
            }
        });
    }

    public select2Changed(e: any, name: string): void {
        this.model[name] = e.value;
    }

}
