import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { APICommonService } from '../../_services/index';
import { AppConfig } from '../../app.config';

import * as _ from 'lodash';
import { Cipe, CipeOdg } from '../../_models/index';
import { DragulaService } from 'ng2-dragula';

@Component({
    templateUrl: 'cipe-edit.component.html'
})

export class CipeEditComponent implements OnInit {

    private config: any;
    public model: any = {};

    public _: any;

    private allowUpload= false;

    private error = '';
    public mode: string;
    private loading= true;
    private id: number;
    private baseAPIURL: string;
    public datePickerOptions;

    public officializingCipe = null;

    constructor(private router: Router,
                private route: ActivatedRoute,
                public apiService: APICommonService,
                private dragulaService: DragulaService,
                config: AppConfig,
    ) {
        this.config = config.getConfig();
        this.baseAPIURL =  this.config.baseAPIURL + '/api/cipe/';

        this.datePickerOptions = config.datePickerOptions;

        dragulaService.drag.subscribe((value) => {
            console.log(`drag: ${value[0]}`);
            this.onDrag(value.slice(1));
        });
        dragulaService.drop.subscribe((value) => {
            console.log(`drop: ${value[0]}`);
            this.onDrop(value.slice(1));
        });
        dragulaService.over.subscribe((value) => {
            console.log(`over: ${value[0]}`);
            this.onOver(value.slice(1));
        });
        dragulaService.out.subscribe((value) => {
            console.log(`out: ${value[0]}`);
            this.onOut(value.slice(1));
        });
    }

    ngOnInit() {
        this.apiService.refreshCommonCache();

        this.id = +this.route.snapshot.params['id'];
        this.mode = isNaN(this.id) ? 'create' : 'update';

        switch ( this.mode ) {
            case 'create':
                this.model = new Cipe();
                this.addPuntoOdg();

                //console.log(this.model);
                this.loading = false;
                break;
            case 'update':
                this.apiService.getById('cipe', this.id)
                    .subscribe(
                        response => {
                            this.model = response.data;
                            this.model.data = new Date(this.model.data);

                            // todo: chiedere ad alessando di aggiungere i campi
                            //this.model.cipe_odg = _.map(this.model.cipe_odg, o => _.extend({allegati_esclusi: [],
                            // allegati_esclusi_approvati: []}, o));

                            this.loading = false;
                            this.allowUpload = true;
                            // console.log(this.model);

                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;
        }
    }

    addPuntoOdg() {
        this.model.cipe_odg.push(new CipeOdg());
    }

    castToArray(item) {
        return item ? _.castArray(item) : [];
    }

    cancel( event ) {
        this.router.navigate(['/app/cipe/list']);
    }

    submit() {
        this.loading = true;

        switch ( this.mode ) {
            case 'create':
                this.apiService.create('cipe', this.model)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/cipe/list']);
                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;

            case 'update':
                this.apiService.update('cipe', this.model)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/cipe/list']);
                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;
        }
    }

    private onDrag(args) {
        const [e, el] = args;
        // do something
    }

    private onDrop(args) {
        const [e, el] = args;
        // do something
    }

    private onOver(args) {
        const [e, el, container] = args;
        // do something
    }

    private onOut(args) {
        const [e, el, container] = args;
        // do something
    }


    /*
     *
     * OFFICIALIZE PRE-CIPE
     *
     */

    askOfficializeCipe(event: any, modal: any, cipe: Cipe) {
        event.stopPropagation();
        event.preventDefault();
        this.officializingCipe = cipe;
        modal.open();
        return false;
    }

    confirmOfficializeCipe(modal: any) {
        modal.close();
        this.officializeCipe(this.officializingCipe);
    }

    cancelOfficializeCipe(modal: any) {
        modal.close();
        this.officializingCipe = null;
    }

    officializeCipe(cipe: Cipe){
        setTimeout(() => {
            this.model.ufficiale_riunione = '1';
            this.officializingCipe = null;
        }, 4000);
    }

    private jwt() {
        // get jwt token
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            return currentUser.token;
        }
    }
}