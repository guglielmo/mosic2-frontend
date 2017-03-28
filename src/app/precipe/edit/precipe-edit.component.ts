import { Component, OnInit, EventEmitter, NgZone, Inject} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { APICommonService } from '../../_services/index';
import { AppConfig } from '../../app.config';

import { Titolari, Fascicoli, Registri, Uffici } from '../../_models/index';
import { NgUploaderOptions, UploadedFile } from 'ngx-uploader';

import * as _ from 'lodash';
import { Precipe, PrecipeOdg } from '../../_models/index';
import { DragulaService } from 'ng2-dragula';


@Component({
    templateUrl: 'precipe-edit.component.html'
})

export class PreCipeEditComponent implements OnInit {

    private config: any;
    public model: any = {};
    public titolari$: Observable<Titolari[]>;
    public fascicoli$: Observable<Fascicoli[]>;
    public registri$: Observable<Registri[]>;
    public uffici$: Observable<Uffici[]>;

    private NGUPoptions_APG: NgUploaderOptions;
    private NGUPoptions_TLX: NgUploaderOptions;
    private NGUPoptions_OSS: NgUploaderOptions;

    private sizeLimit = 1000000; // 1MB
    private previewData: any;
    private errorMessage: string;
    private inputUploadEvents: EventEmitter<string>;
    private hasBaseDropZoneOver: boolean;
    private progress = 0;
    private response: any[] = [];

    private allowUpload= false;

    private select2Options: Select2Options;
    private select2OptionsMulti: Select2Options;
    private select2Debounce = false;

    private error = '';
    public mode: string;
    private loading= true;
    private id: number;
    private baseAPIURL: string;
    public datePickerOptions;

    public officializingPreCipe = null;

    constructor(private router: Router,
                private route: ActivatedRoute,
                public apiService: APICommonService,
                private dragulaService: DragulaService,
                config: AppConfig,
                @Inject(NgZone) private zone: NgZone
    ) {
        this.config = config.getConfig();
        this.baseAPIURL =  this.config.baseAPIURL + '/api/precipe/';

        this.titolari$ = this.apiService.subscribeToDataService('titolari');
        this.fascicoli$ = this.apiService.subscribeToDataService('fascicoli');
        this.registri$ = this.apiService.subscribeToDataService('registri');
        this.uffici$ = this.apiService.subscribeToDataService('uffici');

        this.select2Options = config.select2Options;
        this.select2OptionsMulti = config.select2OptionsMulti;

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

        const baseNGUPoptions = {
            filterExtensions: false,
            maxSize: 250000000,
            data: {id_precipe: this.id},
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
        };

        this.NGUPoptions_APG = new NgUploaderOptions( Object.assign({url: this.baseAPIURL + this.id + '/APG/upload'}, baseNGUPoptions) );
        this.NGUPoptions_TLX = new NgUploaderOptions( Object.assign({url: this.baseAPIURL + this.id + '/TLX/upload'}, baseNGUPoptions) );
        this.NGUPoptions_OSS = new NgUploaderOptions( Object.assign({url: this.baseAPIURL + this.id + '/OSS/upload'}, baseNGUPoptions) );

        this.mode = isNaN(this.id) ? 'create' : 'update';

        switch ( this.mode ) {
            case 'create':
                this.loading = false;
                break;
            case 'update':
                this.apiService.getById('precipe', this.id)
                    .subscribe(
                        response => {
                            this.model = response.data;
                            this.model.data = new Date(this.model.data);
                            this.model.ufficiale_riunione = '0';
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


    public select2Changed(e: any, item: any, name: string): void {

        if (this.select2Debounce) {
            this.select2Debounce = false;
            return;
        }

        if (name === 'id_titolari') {
            this.select2Debounce = true;
            item.id_fascicoli = null;
            item.id_registri = null;
        }

        if (name === 'id_fascicoli') {
            this.select2Debounce = true;
            item.id_registri = null;
        }

        item[name] = e.value;
    }

    /*
     *
     * OFFICIALIZE PRE-CIPE
     *
     */

    askOfficializePreCipe(event: any, modal: any, precipe: Precipe) {
        event.stopPropagation();
        event.preventDefault();
        this.officializingPreCipe = precipe;
        modal.open();
        return false;
    }

    confirmOfficializePreCipe(modal: any) {
        modal.close();
        this.officializePreCipe(this.officializingPreCipe);
    }

    cancelOfficializePreCipe(modal: any) {
        modal.close();
        this.officializingPreCipe = null;
    }

    officializePreCipe(precipe: Precipe){
        setTimeout(() => {
            this.model.ufficiale_riunione = '1';
            this.officializingPreCipe = null;
        }, 4000);
    }


    // todo: this should be in apiService but couldn't find yet how to call injected classes methods from templates
    public registriEnum(val: string): string {

        const e = this.apiService.dataEnum['registri'];
        if (-1 !== String(val).indexOf(',') ) {
            const ret = [];
            String(val).split(',').forEach( item => {
                ret.push(e[item]['text']);
            });
            return ret.join(', ');

        } else if (val) {

            return e[val] ? e[val]['text'] : '';
        }
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
