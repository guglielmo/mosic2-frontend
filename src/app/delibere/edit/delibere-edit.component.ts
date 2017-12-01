import { AfterViewChecked, Component, EventEmitter, Inject, NgZone, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APICommonService } from '../../_services/index';
import { AppConfig } from '../../app.config';
import { NgUploaderOptions, UploadedFile } from 'ngx-uploader';
import { Observable } from 'rxjs/Observable';


import { Delibere } from '../../_models/delibere'
import { Firmatari } from '../../_models/firmatari';
import { Uffici } from '../../_models/uffici';
import { Allegati } from '../../_models/allegati';
import { Tags } from '../../_models/tags';


import * as _ from 'lodash';

@Component({
    templateUrl: 'delibere-edit.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DelibereEditComponent implements OnInit, AfterViewChecked, OnDestroy {

    public config: any;
    public model: any = {};
    public error = '';
    public mode: string;
    private loading = false;
    private scrollDone = false;
    public allowUpload = false;
    private id: number;

    public cipeODG: any = {};

    private routeFragmentSubscription: any;

    public NGUPoptions: NgUploaderOptions;
    public previewData: any;
    public errorMessage: string;
    private inputUploadEvents: EventEmitter<string>;
    public hasBaseDropZoneOver: boolean;
    public progress = 0;
    private response: any[] = [];

    public deletingFile: Allegati = new Allegati;

    public firmatari$: Observable<Firmatari[]>;
    public uffici$: Observable<Uffici[]>;
    public tags$: Observable<Tags[]>;

    public datePickerOptions: any;
    public select2Options: Select2Options;
    public select2WithAddOptions: Select2Options;
    public select2OptionsMulti: Select2Options;
    public select2WithAddOptionsMulti: Select2Options;

    public canEdit: boolean = false;
    public canDelete: boolean = false;

    constructor(private router: Router,
                private route: ActivatedRoute,
                public apiService: APICommonService,
                config: AppConfig,
                @Inject(NgZone) private zone: NgZone) {

        this.config = config.getConfig();

        this.datePickerOptions = config.datePickerOptions;
        this.select2Options = config.select2Options;
        this.select2WithAddOptions = config.select2WithAddOptions;
        this.select2OptionsMulti = config.select2OptionsMulti;
        this.select2WithAddOptionsMulti = config.select2WithAddOptionsMulti;

        this.firmatari$ = this.apiService.subscribeToDataService('firmatari');
        this.uffici$ = this.apiService.subscribeToDataService('uffici');
        this.tags$ = this.apiService.subscribeToDataService('tags');

        this.inputUploadEvents = new EventEmitter<string>();
    }

    ngOnInit() {
        this.apiService.refreshCommonCache();

        this.id = this.route.snapshot.params['id'];

        this.NGUPoptions = new NgUploaderOptions({
            url: this.config.baseAPIURL + '/api/delibere/' + this.id + '/upload',
            // url: 'http://upload.mosic.hantarex.org/upload.php',
            filterExtensions: false,
            maxSize: 250000000,
            data: {id_registri: this.id},
            autoUpload: true,
            fieldName: 'file',
            fieldReset: true,
            maxUploads: 999,
            method: 'POST',
            previewUrl: true,
            cors: true,
            withCredentials: true,
            authTokenPrefix: 'Bearer',
            authToken: this.jwt()
        });

        this.mode = isNaN(this.id) ? 'create' : 'update';
        this.canEdit = isNaN(this.id) ? this.apiService.userCan('CREATE_DELIBERE') : this.apiService.userCan('EDIT_DELIBERE');
        this.canDelete = this.apiService.userCan('DELETE_DELIBERE');

        switch (this.mode) {
            case 'create':
                this.model =  new Delibere();
                break;

            case 'update':
                this.apiService.getById('delibere', this.id)
                    .subscribe(
                        response => {
                            this.model = response.data;

                            // instantiate every date
                            let tz = new Date().getTimezoneOffset();
                            _.forEach(this.model, (value, key) => {
                                if(key && key.indexOf('data') !== -1) {
                                    if(value) {
                                        this.model[key] = new Date(value);
                                    }
                                }
                            });

                            _.forEach(this.model.cipe_delibere, (cipe_odg, key) => {
                                //console.log('cipe_odg', cipe_odg, key );
                                if(cipe_odg.id_cipe_odg) {
                                    this.loadCipeOdg(cipe_odg.id_cipe_odg);
                                }
                                //id_cipe_odg
                                //
                            });

                            if(!this.model.data_mef_pec && this.model.data_mef_invio) {
                                this.model.data_mef_pec = this.model.data_mef_invio;
                            }

                            this.allowUpload = true;
                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;
        }
    }

    loadCipeOdg(id) {
        this.apiService.getById('cipeodg', id)
            .subscribe(
                response => {
                    this.cipeODG[id] = response.data;

                    console.log(this.cipeODG);
                },
                error => {

                }
            );
    }

    ngAfterViewChecked() {
        // checks if there's an anchor hash in the URL and jumps to it
        this.routeFragmentSubscription = this.route.fragment
            .subscribe(fragment => {
                if (!this.scrollDone && fragment) {
                    const element = document.getElementById(fragment);
                    if (element) {
                        element.scrollIntoView();
                        this.scrollDone = true;
                    }
                }
            });
    }

    ngOnDestroy() {
        this.routeFragmentSubscription.unsubscribe();
    }

    cancel(event) {
        this.router.navigate(['/app/delibere/list']);
    }

    submit(event: any, modal: any) {
        this.loading = true;

        //console.log(new Delibere());

        let post = $.extend(true, new Delibere(), this.model);
        let tz = new Date().getTimezoneOffset();


        // convert every date to milliseconds
        _.forEach(post, (value, key) => {
            if(key && key.indexOf('data') !== -1) {
                // console.log(key, typeof value, value);
                if(value) {
                    post[key] = new Date(value.getTime());
                }
            }
        });

        switch (this.mode) {
            case 'create':
                this.apiService.create('delibere', post)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/delibere/list']);
                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;

            case 'update':
                this.apiService.update('delibere', post)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/delibere/list']);
                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;
        }
    }

    select2Changed(e: any, name: string): void {

        // converts value to arrays to handle multi-selects and selects in the same way
        let V = typeof e.value === 'string' ? e.value.split(',') : e.value;
        if (!V) { V = [] }

        // breaks the process if the value didn't change (select2 produces false positives)
        if(typeof this.model[name] === 'string') {
            if(V.join(',') === this.model[name]) {
                return;
            }
        } else if (Array.isArray(this.model[name])) {

            if(V.join(',') === this.model[name].join(',')) {
                return;
            }
        }

        // console.log(name, e.value, this.model[name]);

        // console.log(this.model);
        let selectedCount = 0;
        if ( Array.isArray(this.model[name]) ) {
            selectedCount = this.model[name].length;
        } else {
            selectedCount = this.model[name] ? this.model[name].split(',').length : 0;
        }


        if (V.length > selectedCount) {
            // Value added
            console.log('value added');
            this.mayBeCreateNewSelect2Values(name, V);

        } else if (V.length < selectedCount) {
            // Value removed
            // console.log('value removed');

        } else if (V.join(',') !== this.model[name]) {
            // console.log('value changed');
            this.mayBeCreateNewSelect2Values(name, V);
        }

        // go back to comma separated strings in the model value as the server handles
        // both single and multi selects as strings

        if (Array.isArray( this.model[name] )) {
            this.model[name] = V;
        } else {
            this.model[name] = V.join(',');
        }
    }


    mayBeCreateNewSelect2Values(name, V) {

        let newValues = [];
        const apiPath = name.split('_')[1];
        for(let i=0; i<V.length; i++) {
            if(V[i] != '' && !this.apiService.dataEnum[apiPath][V[i]]) {
                // value doesn't exist
                console.log("Value '"+V[i]+"' doesn't exist");
                newValues.push(V[i]);
            }
        }

        // console.log('trying to add new ' + name, '#' + name + ' select option[data-select2-tag="true"]');

        // const newValues = $('#' + name + ' select option[data-select2-tag="true"]');

        // console.log(newValues.length);

        if (newValues.length) {

            const apipath = name.split('_')[1];

            newValues.forEach((elem) => {

                // console.log(name, newValues, elem);

                this.apiService.create(apipath, { 'denominazione': elem } )
                    .subscribe(
                        response => {

                            this.apiService.refreshCommonCache();

                            const id = response.data.id,
                                den = response.data.denominazione;

                            const label = id + ' - ' + den;
                            response.data.text = label;

                            // creates the new entry on the relative apiService select2 data
                            // this.apiService[apipath+'Select'].push(response.data);

                            // find the select element and update temporary id with the new assigned id
                            $('#' + name + ' select option[value="' + den + '"]').val(id).text(label);

                            // replace the temporary id in the model with the new assigned id
                            const selectedValues = this.model[name].split(',');

                            const i = _.indexOf(selectedValues, _.find(selectedValues, den));
                            selectedValues.splice(i, 1, String(id));

                            if( Array.isArray(this.model[name])) {
                                this.model[name] = selectedValues;
                            } else {
                                this.model[name] = selectedValues.join(',');
                            }


                            // update select2 data
                            // $('#'+name+' select').select2('data',response.data, true);

                            // find the select2 choice and update the temporary label with the new assigned id
                            // $('#'+name+' .select2-selection__choice[title="'+den+'"]').prop('title',label);
                        },
                        error => {
                            this.error = error; console.log(error);
                        });
            });
        }
    };

    askDeleteFile(event: any, modal: any, allegato: Allegati) {
        event.stopPropagation();
        this.deletingFile = allegato;
        modal.open();
    }

    confirmDeleteFile(modal: any) {
        modal.close();
        this.deleteFile(this.deletingFile);
        this.deletingFile = new Allegati;
    }

    deleteFile(allegato: Allegati) {
        this.apiService.deleteFile('registri', this.id, allegato.id)
            .subscribe(
                data => {
                    console.log('deleted', data.id_allegati);
                    this.model.allegati = this.model.allegati.filter(function( obj ) {
                        return obj.id !== data.id_allegati;
                    });
                    this.apiService.refreshCommonCache();
                }, error => {
                    this.error = error; console.log(error);
                }
            );
    }

    /*
     *
     * FILE UPLOAD
     *
     */

    startUpload(e) {
        console.log(e);
        this.inputUploadEvents.emit('startUpload');
    }

    rejectUpload(e) {
        console.log(e);
        this.errorMessage = 'Il file è troppo grande. (Max: 25MB)';
    }

    beforeUpload(uploadingFile: UploadedFile): void {
        if (uploadingFile.size > 250000000) {
            uploadingFile.setAbort();
            this.errorMessage = 'Il file è troppo grande. (Max: 25MB)';
        }
    }

    handleMultipleUpload(data: any): void {

        if (data && data.response === '') {
            // upload error

            this.apiService.notifyError('Si è verificato un errore nel caricamento del file. Consultare la console per ulteriori informazioni.');
            console.log(data);

        } else if (data && data.response && data.response.indexOf('error') !== -1) {

            const response = JSON.parse(data.response);
            this.apiService.notifyError(response.error.message);
            console.log(data);

        } else if (data && data.response) {

            // upload success

            if (data.done) {
                if (!this.model.allegati) { this.model.allegati = []; }
                this.model.allegati.push(JSON.parse(data.response));
            }

            const index = this.response.findIndex(x => x.id === data.id);
            if (index === -1) {
                this.response.push(data);
            } else {
                let total = 0, uploaded = 0;
                this.response.forEach(resp => {
                    total += resp.progress.total;
                    uploaded += resp.progress.loaded;
                });
                const percent = uploaded / (total / 100) / 100;

                // console.log(this.model.allegati);


                this.zone.run(() => {
                    this.response[index] = data;
                    this.progress = percent;
                });
            }
        }
    }

    handlePreviewData(data: any) {
        this.previewData = data;
    }

    fileOverBase(e: boolean) {
        this.hasBaseDropZoneOver = e;
    }

    private jwt() {
        // get jwt token
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            return currentUser.token;
        }
    }

}
