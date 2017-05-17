import {AfterViewChecked, Component, EventEmitter, Inject, NgZone, OnDestroy, OnInit, ViewEncapsulation} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {APICommonService} from "../../_services/index";
import {AppConfig} from "../../app.config";
import {NgUploaderOptions, UploadedFile} from "ngx-uploader";
import {Observable} from "rxjs/Observable";


import {Delibere} from "../../_models/delibere"
import {Firmatari} from "../../_models/firmatari";
import {Uffici} from "../../_models/uffici";
import {Allegati} from "../../_models/allegati";


import * as _ from "lodash";

@Component({
    templateUrl: 'delibere-edit.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DelibereEditComponent implements OnInit, AfterViewChecked, OnDestroy {

    private config: any;
    public model: any = {};
    public error = '';
    public mode: string;
    private loading = false;
    private scrollDone = false;
    public allowUpload = false;
    private id: number;

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

    public datePickerOptions: any;
    public select2Options: Select2Options;
    public select2WithAddOptions: Select2Options;
    public select2OptionsMulti: Select2Options;
    public select2WithAddOptionsMulti: Select2Options;

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

        this.inputUploadEvents = new EventEmitter<string>();
    }

    ngOnInit() {
        this.apiService.refreshCommonCache();

        this.id = +this.route.snapshot.params['id'];

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
        switch (this.mode) {
            case 'create':
                this.model = {
                };
                break;

            case 'update':
                this.apiService.getById('delibere', this.id)
                    .subscribe(
                        response => {
                            if(Array.isArray(response.data)) {
                                this.model = response.data[0];
                            } else {
                                this.model = response.data;
                            }


                            // instantiate every date
                            let tz = new Date().getTimezoneOffset();
                            _.forEach(this.model, (value, key) => {
                                if(key && key.indexOf('data') !== -1) {
                                    if(value) {
                                        this.model[key] = new Date(value + tz*60000);
                                    }
                                }
                            });

                            if(!this.model.data_mef_pec && this.model.data_mef_invio) {
                                this.model.data_mef_pec = this.model.data_mef_invio;
                            }

                            //this.model.data_arrivo = new Date(this.model.data_arrivo);
                            //this.model.data_mittente = new Date(this.model.data_mittente);
                            this.allowUpload = true;
                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;
        }

/*        $('#content').on("select2:select", "#id_mittenti", (e: any) => {
            //console.log('on("select2:select")');
            //console.log('select2:select',e.params.data.id);
            if (e.params.data.isNew) {
                console.log('isNew!', e.params.data);
                this.createTag('mittenti', e.params.data.id);
            }
        });*/
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

        console.log(new Delibere());

        let post = $.extend(true, new Delibere(), this.model);
        let tz = new Date().getTimezoneOffset();


        // convert every date to milliseconds
        _.forEach(post, (value, key) => {
            if(key && key.indexOf('data') !== -1) {
                console.log(key, typeof value, value);
                if(value) {
                    post[key] = new Date(value.getTime() - tz*60000);
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

        this.model[name] = e.value;
    }

    public confirmCodeNotification(modal: any) {
        modal.close();
        this.router.navigate(['/app/registri/edit/' + this.model.id]);
    }

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
