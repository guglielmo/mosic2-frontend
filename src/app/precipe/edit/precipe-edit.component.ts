import {Component, OnInit, Inject} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import {PageScrollInstance, PageScrollService, EasingLogic} from 'ng2-page-scroll';


import { Router, ActivatedRoute } from '@angular/router';
import { APICommonService } from '../../_services/index';
import { AppConfig } from '../../app.config';

import * as _ from 'lodash';
import { PreCipe, PreCipeOdg } from '../../_models/index';
import { DragulaService } from 'ng2-dragula';

@Component({
    templateUrl: 'precipe-edit.component.html'
})

export class PreCipeEditComponent implements OnInit {

    private config: any;
    public model: any = {};

    public _: any;

    private allowUpload= false;

    private error = '';
    public mode: string;
    public compact: true;
    public viewtype: string = 'documents';
    private loading= true;
    private id: number;
    private baseAPIURL: string;
    public datePickerOptions;

    public officializingPreCipe: PreCipe = null;
    public publishingPreCipe: PreCipe = null;
    public removingPreCipe: PreCipe = null;
    public updatingPreCipe: PreCipe = null;
    public deletingPuntoOdg: PreCipeOdg = null;
    public status: string = null;

    constructor(private router: Router,
                private route: ActivatedRoute,
                public apiService: APICommonService,
                private dragulaService: DragulaService,
                @Inject(DOCUMENT) private document: any,
                private pageScrollService: PageScrollService,
                config: AppConfig,
    ) {
        this.config = config.getConfig();
        this.baseAPIURL =  this.config.baseAPIURL + '/api/precipe/';

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
                this.model = new PreCipe();
                this.createPuntoOdg();

                //console.log(this.model);
                this.loading = false;
                break;
            case 'update':
                this.apiService.getById('precipe', this.id)
                    .subscribe(
                        response => {
                            this.model = response.data;
                            this.model.data = new Date(this.model.data);

                            // todo: chiedere ad alessando di aggiungere i campi
                            this.model.public_reserved_URL = "http://www.google.it/bceykber6hiub8nbn8@#gdyuevcuhluickjdbuycgdkyhbckuydgcbdbvuykgwlsxvh";

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

    createPuntoOdg() {
        this.model.precipe_odg.push(new PreCipeOdg());
    }

    public myEasing: EasingLogic = {
        ease: (t: number, b: number, c: number, d: number): number => {
            // easeInOutExpo easing
            if (t === 0) return b;
            if (t === d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    };

    askDeletePuntoOdg(id: number, modal: any) {
        event.stopPropagation();
        event.preventDefault();
        this.deletingPuntoOdg = _.find(this.model.precipe_odg, o => { return o.id === id });
        console.log(id,this.deletingPuntoOdg);
        modal.open();
        return false;
    }

    confirmDeletePuntoOdg(modal: any) {
        modal.close();
        this.deletePuntoOdg(this.deletingPuntoOdg.id);
    }

    cancelDeletePuntoOdg(modal: any) {
        modal.close();
        this.deletingPuntoOdg = null;
    }

    deletePuntoOdg(id: number) {
        this.model.precipe_odg = _.filter(this.model.precipe_odg, o => { return o.id !== id; });
    }

    castToArray(item) {
        return item ? _.castArray(item) : [];
    }

    cancel( event ) {
        this.router.navigate(['/app/precipe/list']);
    }

    submit() {
        this.loading = true;

        switch ( this.mode ) {
            case 'create':
                this.apiService.create('precipe', this.model)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/precipe/list']);
                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;

            case 'update':
                this.apiService.update('precipe', this.model)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/precipe/list']);
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

    startPublishOrUpdate(id){
        this.apiService.getById('areariservata/precipe',id)
            .subscribe(
                response => {
                    this.pollStatus(id);
                    console.log(response);
                },
                error => {
                    console.log(error);

                }
            );
    }

    pollStatus(id){
        this.apiService.getAll('precipe/'+id+'/upload_status')
            .subscribe(
                response => {
                    setTimeout(id => {
                        this.pollStatus(id);
                    },5000);

                    console.log(response);
                },
                error => {
                    console.log(error);

                }
            );
    }

    startRemove(id){

    }


    /*
     *
     * OFFICIALIZE PRE-CIPE
     *
     */

    askOfficializePreCipe(event: any, modal: any, precipe: PreCipe) {
        event.stopPropagation();
        event.preventDefault();
        this.officializingPreCipe = precipe;
        modal.open();
        return false;
    }

    confirmOfficializePreCipe(modal: any) {
        modal.close();
        this.officializePreCipe(this.officializingPreCipe);
        this.status = 'publishing';
    }

    cancelOfficializePreCipe(modal: any) {
        modal.close();
        this.officializingPreCipe = null;
    }

    officializePreCipe(precipe: PreCipe){
        this.startPublishOrUpdate(this.id);

/*        setTimeout(() => {
            this.model.public_reserved_URL = "http://www.google.it/bceykber6hiub8nbn8@#gdyuevcuhluickjdbuycgdkyhbckuydgcbdbvuykgwlsxvh";
            this.model.ufficiale_riunione = '1';
            this.officializingPreCipe = null;
            this.status = null;
        }, 4000);*/
    }

    /*
     *
     * PUBLISH PRE-CIPE
     *
     */

    askPublishPreCipe(event: any, modal: any, precipe: PreCipe) {
        event.stopPropagation();
        event.preventDefault();
        this.publishingPreCipe = precipe;
        modal.open();
        return false;
    }

    confirmPublishPreCipe(modal: any) {
        modal.close();
        this.publishPreCipe(this.publishingPreCipe);
        this.status = 'publishing';
    }

    cancelPublishPreCipe(modal: any) {
        modal.close();
        this.publishingPreCipe = null;
    }

    publishPreCipe(precipe: PreCipe){
        this.startPublishOrUpdate(this.id);

/*        setTimeout(() => {
            this.model.public_reserved_URL = "http://www.google.it/bceykber6hiub8nbn8@#gdyuevcuhluickjdbuycgdkyhbckuydgcbdbvuykgwlsxvh";
            this.model.ufficiale_riunione = '1';
            this.publishingPreCipe = null;
            this.status = null;
        }, 4000);*/
    }    

    /*
     *
     * REMOVE PRE-CIPE
     *
     */

    askRemovePreCipe(event: any, modal: any, precipe: PreCipe) {
        event.stopPropagation();
        event.preventDefault();
        this.removingPreCipe = precipe;
        modal.open();
        return false;
    }

    confirmRemovePreCipe(modal: any) {
        modal.close();
        this.removePreCipe(this.removingPreCipe);
        this.status = 'removing';
    }

    cancelRemovePreCipe(modal: any) {
        modal.close();
        this.removingPreCipe = null;
    }

    removePreCipe(precipe: PreCipe){
        setTimeout(() => {
            this.model.public_reserved_URL = null;
            this.removingPreCipe = null;
            this.status = null;
        }, 4000);
    }


    /*
     *
     * UPDATE PRE-CIPE
     *
     */

    askUpdatePreCipe(event: any, modal: any, precipe: PreCipe) {
        event.stopPropagation();
        event.preventDefault();
        this.updatingPreCipe = precipe;
        modal.open();
        return false;
    }

    confirmUpdatePreCipe(modal: any) {
        modal.close();
        this.updatePreCipe(this.updatingPreCipe);
        this.status = 'updating';
    }

    cancelUpdatePreCipe(modal: any) {
        modal.close();
        this.updatingPreCipe = null;
    }

    updatePreCipe(precipe: PreCipe){
        this.startPublishOrUpdate(this.id);
    }

    private jwt() {
        // get jwt token
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            return currentUser.token;
        }
    }
}
