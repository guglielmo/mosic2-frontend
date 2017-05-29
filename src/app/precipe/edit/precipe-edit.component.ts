import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { APICommonService } from '../../_services/index';
import { AppConfig } from '../../app.config';

import * as _ from 'lodash';
import { PreCipe } from '../../_models/precipe';
import { PreCipeOdg } from '../../_models/precipe_odg';
import { DragulaService } from 'ng2-dragula';
import { ScrollToService } from 'ng2-scroll-to-el';

@Component({
    templateUrl: 'precipe-edit.component.html',
})

export class PreCipeEditComponent implements OnInit {

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

    public officializingPreCipe: PreCipe = null;
    public publishingPreCipe: PreCipe = null;
    public removingPreCipe: PreCipe = null;
    public updatingPreCipe: PreCipe = null;
    public deletingPuntoOdg: PreCipeOdg = null;
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
        this.canEdit = isNaN(this.id) ? this.apiService.userCan('CREATE_PRECIPE') : this.apiService.userCan('EDIT_PRECIPE');
        this.canDelete = this.apiService.userCan('DELETE_PRECIPE');

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

                            this.loading = false;
                            this.allowUpload = true;

                            this.pollStatus(false);
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

        this.model.precipe_odg.push(new PreCipeOdg());

        if(element) {
            this.scrollService.scrollTo(element, 1500);
        }
    }

    askDeletePuntoOdg(id: number, modal: any) {
        //event.stopPropagation();
        //event.preventDefault();
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

        this.apiService.delete('precipeodg', id)
            .subscribe(
                response => {
                    console.log(response);
                    this.model.precipe_odg = _.filter(this.model.precipe_odg, o => { return o.id !== id; });
                },
                error => {
                    console.log(error);
                }
            )
    }

    castToArray(item) {
        return item ? _.castArray(item) : [];
    }

    cancel( event ) {
        this.router.navigate(['/app/precipe/list']);
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
                this.apiService.create('precipe', post)
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
                this.apiService.update('precipe', post)
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
        console.log('ondrag',e, el);
    }

    private onDrop(args) {
        const [e, el] = args;
        // do something
        console.log('ondrop',e, el);
    }

    private onOver(args) {
        const [e, el, container] = args;
        // do something
        console.log('onover',e, el, container);
    }

    private onOut(args) {
        const [e, el, container] = args;
        // do something
        console.log('onout',e, el, container);
    }

    startPublishOrUpdate(){
        this.apiService.getById('areariservata/precipe',this.id)
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
        this.apiService.getById('areariservata/precipe/check', this.id)
            .subscribe(
                response => {
                    if(response.data.message) {
                        _self.status_msg = response.data.message;
                    }


                    if(response.data.public_reserved_url) {
                        _self.model.public_reserved_url = response.data.public_reserved_url;
                    }

                    if(response.data.files_uploaded && response.data.files_total) {
                        if (response.data.files_uploaded === response.data.files_total) {
                            _self.status = null;
                            return;
                        }
                    }

                    if ( repeat ) {
                        setTimeout(function () {
                            _self.pollStatus();
                        }, 2000);
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
        this.apiService.getById('areariservata/precipe/check', id)
            .subscribe(
                response => {
                    console.log(response);
                },
                error => {
                    console.log(error);

                }
            );
    }

    startRemove() {
        let _self = this;
        this.apiService.delete('areariservata/precipe', this.id)
            .subscribe(
                response => {
                    if(response.data.message) {
                        _self.status_msg = response.data.message;
                        _self.model.public_reserved_url = null;
                        _self.status = null;
                    }
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
                }
            )
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
        this.startPublishOrUpdate();
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
        this.startPublishOrUpdate();
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
        this.startRemove();
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
