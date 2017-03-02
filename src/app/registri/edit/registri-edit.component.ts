import { Component, OnInit, ViewEncapsulation, NgZone, Inject, EventEmitter, AfterViewChecked, ChangeDetectorRef, Renderer, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//import {__platform_browser_private__} from '@angular/platform-browser'; // needed for select2 styles override hack

import {Titolari, Fascicoli, Amministrazioni, Mittenti} from '../../_models/index';
import {APICommonService} from '../../_services/index';
import {AppConfig} from '../../app.config';

import { NgUploaderOptions, UploadedFile, UploadRejected } from 'ngx-uploader';

@Component({
    templateUrl: 'registri-edit.component.html',
    encapsulation: ViewEncapsulation.None
})
export class RegistriEditComponent implements OnInit, AfterViewChecked, OnDestroy {

    config: any;
    model: any = {};
    error: string = '';
    mode: string;
    loading: boolean = false;
    allowUpload: boolean = false;
    id: number;
    selected: any;

    routeFragmentSubscription: any;

    options: NgUploaderOptions;
    sizeLimit: number = 1000000; // 1MB
    previewData: any;
    errorMessage: string;
    inputUploadEvents: EventEmitter<string>;
    hasBaseDropZoneOver: boolean;
    private progress: number = 0;
    private response: any[] = [];

    titolari: Titolari[] = [];
    fascicoli: Fascicoli[] = [];
    amministrazioni: Amministrazioni[] = [];
    mittenti: Mittenti[] = [];

    public select2Options: Select2Options;
    public select2WithAddOptions: Select2Options;
    public select2OptionsMulti: Select2Options;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private apiService: APICommonService,
                private changeDetectionRef : ChangeDetectorRef,
                private renderer: Renderer,
                config: AppConfig,
                @Inject(NgZone) private zone: NgZone
    ) {

        this.config = config.getConfig();

        this.select2Options = config.select2Options;
        this.select2WithAddOptions = config.select2WithAddOptions;
        this.select2OptionsMulti = Object.assign({}, config.select2Options);
        this.select2OptionsMulti['multiple'] = true;

        this.select2WithAddOptions = Object.assign({}, config.select2Options);
        this.select2WithAddOptions['tags'] = true;

        this.select2WithAddOptions['insertTag'] = (data, tag) => {
            console.log("select2WithAddOptions['insertTag']", data.length);

            let markup = '';
            if(data.length === 0) {
                markup += "<strong>Nessuna corrispondenza trovata</strong><br/>";
            }
                markup += '<h5><i class="fa fa-plus-circle"> </i> Aggiungi <strong>'+tag.text+'</strong></h5>';
                tag.text = markup;
                data.push(tag);

            //this.changeDetectionRef.detectChanges();
        };

        this.select2WithAddOptions['createTag'] = (tag) => {
            console.log("select2WithAddOptions['createTag']");
            return {
                id: tag.term,
                text: tag.term,
                isNew : true
            };
        };

        this.inputUploadEvents = new EventEmitter<string>();
    }

    ngOnInit() {
        this.apiService.refreshCommonCache();

        this.id = +this.route.snapshot.params['id'];

        this.options = new NgUploaderOptions({
            url: this.config.baseAPIURL + '/api/registri/' + this.id + '/upload',
            //url: 'http://upload.mosic.hantarex.org/upload.php',
            filterExtensions: true,
            allowedExtensions: ['jpg', 'png', 'gif', 'pdf', 'doc'],
            maxSize: 250000000,
            data: { id_registri: this.id },
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
                    "id_titolari": -1,
                    "id_fascicoli": -1,
                    "id_mittenti": -1,
                };
                break;

            case 'update':
                this.apiService.getById('registri', this.id)
                    .subscribe(
                        response => {
                            this.model = response.data;
                            this.model.data_arrivo = new Date(this.model.data_arrivo);
                            this.model.data_mittente = new Date(this.model.data_mittente);
                            this.allowUpload = true;
                        },
                        error => {
                            this.error = error;
                            this.loading = false;
                        });
                break;
        }

        $('#content').on("select2:select", "#id_mittenti", (e: any) => {
            console.log('on("select2:select")');
            //console.log('select2:select',e.params.data.id);
            if (e.params.data.isNew) {
                console.log('isNew!',e.params.data);
                this.createTag('mittenti',e.params.data.id);
            }
        });
    }

    ngAfterViewChecked() {
        // checks if there's an anchor hash in the URL and jumps to it
        this.routeFragmentSubscription = this.route.fragment
            .subscribe(fragment => {
                if (fragment) {
                    let element = document.getElementById(fragment);
                    if (element) {
                        element.scrollIntoView();
                    }
                }
            });
    }

    createTag(type: string, name: string ) {
        let data = { 'denominazione': name };
        this.apiService.create(type, data)
            .subscribe(
                data => {
                    console.log(data);
                },
                error => {
                    this.error = error;
                });
    }

    ngOnDestroy() {
        this.routeFragmentSubscription.unsubscribe();
    }

    cancel( event ) {
        this.router.navigate(['/app/registri/list']);
    }

    submit(event: any, modal: any) {
        this.loading = true;

        switch (this.mode) {
            case 'create':
                this.apiService.create('registri', this.model)
                    .subscribe(
                        data => {
                            console.log(data);
                            this.model = data;
                            modal.open();
                        },
                        error => {
                            this.error = error;
                            this.loading = false;
                        });
                break;

            case 'update':
                this.apiService.update('registri', this.model)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/registri/list']);
                        },
                        error => {
                            this.error = error;
                            this.loading = false;
                        });
                break;
        }
    }

    select2Changed(e: any, name: string): void {

        this.model[name] = typeof e.value === 'object' ? e.value.join(',') : e.value;

        if( name == 'id_titolari' || name == 'id_fascicoli') {
            this.allowUpload = false;
        }

/*        console.log(name, e.value);
        if(parseInt(e.value)) {
            this.model[name] = Number(e.value);
        } else {
            this.model[name] = e.value;
        }*/
    }

    public confirmCodeNotification(modal: any) {
        modal.close();
        this.router.navigate(['/app/registri/edit/'+this.model.id]);
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
        this.errorMessage = 'File is too large!';
    }

    beforeUpload(uploadingFile: UploadedFile): void {
        if (uploadingFile.size > 250000000) {
            uploadingFile.setAbort();
            this.errorMessage = 'Il file è troppo grande. (Max: 25MB)';
        }
    }

    handleMultipleUpload(data: any): void {

        let index = this.response.findIndex(x => x.id === data.id);
        if (index === -1) {
            this.response.push(data);
        } else {
            let total = 0, uploaded = 0;
            this.response.forEach(resp => {
                total += resp.progress.total;
                uploaded += resp.progress.loaded;
            });
            let percent = uploaded / (total / 100) / 100;

            if(data.done) {
                if(!this.model.allegati) this.model.allegati = [];
                this.model.allegati.push(JSON.parse(data.response));
            }

            //console.log(this.model.allegati);


            this.zone.run(() => {
                this.response[index] = data;
                this.progress = percent;
            });
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
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            return currentUser.token;
        }
    }

}
