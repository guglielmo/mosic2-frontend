import { Component, Input, OnInit, EventEmitter, NgZone, Inject} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APICommonService } from '../../_services/index';
import { AppConfig } from '../../app.config';

import { NgUploaderOptions, UploadedFile } from 'ngx-uploader';
import { Allegati } from "../../_models/allegati";

@Component({
    selector: 'cipe-upload',
    templateUrl: 'cipe-upload.component.html'
})

export class CipeUploadComponent implements OnInit {
    @Input() type: string;
    @Input() allegati: Allegati[];
    @Input() allowUpload: boolean;

    private config: any;

    public NGUPoptions: NgUploaderOptions;

    public progress = 0;
    public previewData: any;
    public errorMessage: string;
    public response: any[] = [];
    private inputUploadEvents: EventEmitter<string>;
    private hasBaseDropZoneOver: boolean;


    private error = '';
    public mode: string;
    private id: number;
    private baseAPIURL: string;

    public deletingFile: Allegati = new Allegati;

    constructor(
        private route: ActivatedRoute,
        public apiService: APICommonService,
        config: AppConfig,
        @Inject(NgZone) private zone: NgZone
    ){
        this.config = config.getConfig();
        this.baseAPIURL =  this.config.baseAPIURL + '/api/precipe/';
    }

    ngOnInit(){

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

        this.NGUPoptions = new NgUploaderOptions( Object.assign({url: this.baseAPIURL + this.id + '/' + this.type + '/upload'}, baseNGUPoptions) );
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
                this.allegati.push(JSON.parse(data.response));
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
        this.apiService.deleteFile('precipe', this.id + '/' + this.type, allegato.id)
            .subscribe(
                data => {
                    console.log('deleted', data.id_allegati);
                    this.allegati = this.allegati.filter(function( obj ) {
                        return obj.id !== data.id_allegati;
                    });
                    this.apiService.refreshCommonCache();
                }, error => {
                    this.error = error; console.log(error);
                }
            );
    }

    private jwt() {
        // get jwt token
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            return currentUser.token;
        }
    }

}