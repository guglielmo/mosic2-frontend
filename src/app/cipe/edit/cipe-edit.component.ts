import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { APICommonService } from '../../_services/index';
import { AppConfig } from '../../app.config';

import * as _ from 'lodash';
import { Cipe } from '../../_models/cipe';
import { CipeOdg } from '../../_models/cipe_odg';
import { DragulaService } from 'ng2-dragula';
import { ScrollToService } from 'ng2-scroll-to-el';


@Component({
    templateUrl: 'cipe-edit.component.html'
})

export class CipeEditComponent implements OnInit {

    private config: any;
    public model: any = {};

    public _: any;

    public allowUpload= false;

    private error = '';
    public mode: string;
    public compact: true;
    public viewtype: string = 'documents';
    private loading= true;
    private id: number;
    private baseAPIURL: string;

    public datePickerOptions;

    public officializingCipe = null;
    public publishingCipe: Cipe = null;
    public removingCipe: Cipe = null;
    public updatingCipe: Cipe = null;
    public deletingPuntoOdg: CipeOdg = null;
    public status: string = null;
    public status_msg: null;

    public canEdit: boolean = false;
    public canDelete: boolean = false;

    constructor(private router: Router,
                private route: ActivatedRoute,
                public apiService: APICommonService,
                private dragulaService: DragulaService,
                private scrollService: ScrollToService,
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
        this.canEdit = isNaN(this.id) ? this.apiService.userCan('CREATE_CIPE') : this.apiService.userCan('EDIT_CIPE');
        this.canDelete = this.apiService.userCan('DELETE_CIPE');

        switch ( this.mode ) {
            case 'create':
                this.model = new Cipe();
                this.createPuntoOdg();

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
                            //this.model.public_reserved_url =
                            // "http://www.google.it/bceykber6hiub8nbn8@#gdyuevcuhluickjdbuycgdkyhbckuydgcbdbvuykgwlsxvh";

                            this.loading = false;
                            this.allowUpload = true;

                            this.pollStatus(false);
                            // console.log(this.model);
                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;
        }
    }

    createPuntoOdg($event?, element?) {
        if($event) {
            $event.preventDefault();
            $event.stopPropagation();
        }

        this.model.cipe_odg.push(new CipeOdg());

        if(element) {
            this.scrollService.scrollTo(element, 1500);
        }
    }

    askDeletePuntoOdg(id: number, modal: any) {
        //event.stopPropagation();
        //event.preventDefault();
        this.deletingPuntoOdg = _.find(this.model.cipe_odg, o => { return o.id === id });
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

        if(id === null) {
            this.model.cipe_odg = _.filter(this.model.cipe_odg, o => { return o.id !== id; });
        } else {
            this.apiService.delete('cipeodg', id)
                .subscribe(
                    response => {
                        console.log(response);
                        this.model.cipe_odg = _.filter(this.model.cipe_odg, o => { return o.id !== id; });
                    },
                    error => {
                        console.log(error);
                    }
                )
        }
    }

    castToArray(item) {
        return item ? _.castArray(item) : [];
    }

    cancel( event ) {
        this.router.navigate(['/app/cipe/list']);
    }

    submit() {
        this.loading = true;

        let post = $.extend(true, {}, this.model);
        let tz = new Date().getTimezoneOffset();

        // convert every date to milliseconds
        _.forEach(post, (value, key) => {
            if(key && key.indexOf('data') !== -1) {
                if(value) {
                    post[key] = new Date(value.getTime() - tz*60000);
                }
            }
        });

        switch ( this.mode ) {
            case 'create':
                this.apiService.create('cipe', post)
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
                this.apiService.update('cipe', post)
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

    startPublishOrUpdate(){
        this.apiService.getById('areariservata/cipe', this.id)
            .subscribe(
                response => {
                    this.pollStatus();
                    console.log(response);
                },
                error => {
                    console.log(error);

                }
            );
    }

    pollStatus( repeat = true ){
        let _self = this;
        this.apiService.getById('areariservata/cipe/check', this.id)
            .subscribe(
                response => {
                    if(response.data.message) {
                        _self.status_msg = response.data.message;
                    }

                    if ( repeat ) {
                        setTimeout(function () {
                                _self.pollStatus();
                        }, 5000);
                    }


                    console.log(response);
                },
                error => {

                    if(error.error) {
                        _self.status = 'error';
                        if(error.error.message) {
                            _self.status_msg = error.error.message;
                        }
                        if(error.error.url) {
                            _self.model.public_reserved_url = error.error.url;
                        }
                    }

                    console.log(error.error.url);
                }
            );
    }

    getStatus(id) {
        this.apiService.getById('areariservata/cipe/check', id)
            .subscribe(
                response => {
                    console.log(response);
                },
                error => {
                    console.log(error);

                }
            );
    }

    startRemove(){
        this.apiService.delete('areariservata/cipe', this.id)
            .subscribe(
                response => {
                    console.log(response);
                },
                error => {
                    console.log(error);

                }
            );
    }


    /*
     *
     * OFFICIALIZE CIPE
     *
     */

    askOfficializeCipe(event: any, modal: any, Cipe: Cipe) {
        event.stopPropagation();
        event.preventDefault();
        this.officializingCipe = Cipe;
        modal.open();
        return false;
    }

    confirmOfficializeCipe(modal: any) {
        modal.close();
        this.officializeCipe(this.officializingCipe);
        this.status = 'publishing';
    }

    cancelOfficializeCipe(modal: any) {
        modal.close();
        this.officializingCipe = null;
    }

    officializeCipe(Cipe: Cipe){
        this.startPublishOrUpdate();
    }

    /*
     *
     * PUBLISH CIPE
     *
     */

    askPublishCipe(event: any, modal: any, Cipe: Cipe) {
        event.stopPropagation();
        event.preventDefault();
        this.publishingCipe = Cipe;
        modal.open();
        return false;
    }

    confirmPublishCipe(modal: any) {
        modal.close();
        this.publishCipe(this.publishingCipe);
        this.status = 'publishing';
    }

    cancelPublishCipe(modal: any) {
        modal.close();
        this.publishingCipe = null;
    }

    publishCipe(Cipe: Cipe){
        this.startPublishOrUpdate();
    }

    /*
     *
     * REMOVE CIPE
     *
     */

    askRemoveCipe(event: any, modal: any, Cipe: Cipe) {
        event.stopPropagation();
        event.preventDefault();
        this.removingCipe = Cipe;
        modal.open();
        return false;
    }

    confirmRemoveCipe(modal: any) {
        modal.close();
        this.removeCipe(this.removingCipe);
        this.status = 'removing';
    }

    cancelRemoveCipe(modal: any) {
        modal.close();
        this.removingCipe = null;
    }

    removeCipe(cipe: Cipe){
        this.startRemove();
    }


    /*
     *
     * UPDATE CIPE
     *
     */

    askUpdateCipe(event: any, modal: any, Cipe: Cipe) {
        event.stopPropagation();
        event.preventDefault();
        this.updatingCipe = Cipe;
        modal.open();
        return false;
    }

    confirmUpdateCipe(modal: any) {
        modal.close();
        this.updateCipe(this.updatingCipe);
        this.status = 'updating';
    }

    cancelUpdateCipe(modal: any) {
        modal.close();
        this.updatingCipe = null;
    }

    updateCipe(cipe: Cipe){
        this.startPublishOrUpdate();
    }

    private jwt() {
        // get jwt token
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            return currentUser.token;
        }
    }
}
