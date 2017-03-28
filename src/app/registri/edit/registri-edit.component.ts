import {
    Component,
    OnInit,
    ViewEncapsulation,
    NgZone,
    Inject,
    EventEmitter,
    AfterViewChecked,
    OnDestroy
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Titolari, Fascicoli, Amministrazioni, Mittenti, Allegati } from '../../_models/index';
import { APICommonService } from '../../_services/index';
import { AppConfig } from '../../app.config';
import { NgUploaderOptions, UploadedFile } from 'ngx-uploader';
import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';

@Component({
    templateUrl: 'registri-edit.component.html',
    encapsulation: ViewEncapsulation.None
})
export class RegistriEditComponent implements OnInit, AfterViewChecked, OnDestroy {

    private config: any;
    public model: any = {};
    private error = '';
    public mode: string;
    private loading = false;
    private select2Debounce = false;
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

    public titolari$: Observable<Titolari[]>;
    public fascicoli$: Observable<Fascicoli[]>;
    public amministrazioni$: Observable<Amministrazioni[]>;
    public mittenti$: Observable<Mittenti[]>;

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

        this.select2Options = config.select2Options;
        this.select2WithAddOptions = config.select2WithAddOptions;
        this.select2OptionsMulti = config.select2OptionsMulti;
        this.select2WithAddOptionsMulti = config.select2WithAddOptionsMulti;

        this.titolari$ = this.apiService.subscribeToDataService('titolari');
        this.fascicoli$ = this.apiService.subscribeToDataService('fascicoli');
        this.amministrazioni$ = this.apiService.subscribeToDataService('amministrazioni');
        this.mittenti$ = this.apiService.subscribeToDataService('mittenti');

        this.inputUploadEvents = new EventEmitter<string>();
    }

    ngOnInit() {
        this.apiService.refreshCommonCache();

        this.id = +this.route.snapshot.params['id'];

        this.NGUPoptions = new NgUploaderOptions({
            url: this.config.baseAPIURL + '/api/registri/' + this.id + '/upload',
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
                    'id_titolari': '',
                    'id_fascicoli': '',
                    'id_mittenti': '',
                    'id_amministrazioni': '',
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
                            this.error = error; console.log(error);
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
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;
        }
    }

    select2Changed(e: any, name: string): void {

        if (this.select2Debounce) {
            this.select2Debounce = false;
            return;
        }

        // converts value to arrays to handle multi-selects and selects in the same way
        let V = [];
        if (null != e.value) {
            switch (typeof e.value) {
                case 'string':
                    V = e.value.split(',');
                    break;
                case 'object':
                    V = e.value;
                    break;
            }
        }

        let selectedCount = 0;
        if (typeof this.model[name] === 'string' && this.model[name] !== '') {
            selectedCount = this.model[name].split(',').length;
        }

        if (V.length > selectedCount) {
            // Value added
            // console.log('value added');
            this.mayBeCreateNewSelect2Values(name);

        } else if (V.length < selectedCount) {
            // Value removed
            // console.log('value removed');

        } else if (V.join(',') !== this.model[name]) {
            // console.log('value changed');
            this.mayBeCreateNewSelect2Values(name);
        }

        // don't allow upload when registro classification is changed
        // as we first need to move the current files on the server
        if (name === 'id_titolari' || name === 'id_fascicoli') {
            this.allowUpload = false;
        }

        // go back to comma separated strings in the model value as the server handles
        // both single and multi selects as strings
        this.model[name] = V.join(',');

        // debounce change events and reset id_fascicoli when titolari changes
        if (name === 'id_titolari') {
            this.select2Debounce = true;
            this.model.id_fascicoli = '';
        }
    }

    mayBeCreateNewSelect2Values(name) {

        const newValues = $('#' + name + ' select option[data-select2-tag="true"]');

        if (newValues.length) {

            const apipath = name.split('_')[1];

            newValues.each((index: number, elem: HTMLInputElement) => {

                this.apiService.create(apipath, { 'denominazione': elem.value } )
                    .subscribe(
                        response => {
                            const id = response.data.id,
                                 den = response.data.denominazione;

                            const label = id + ' - ' + den;
                            response.data.text = label;

                            // creates the new entry on the relative apiService select2 data
                            this.apiService[apipath + 'Select'].push(response.data);

                            // find the select element and update temporary id with the new assigned id
                            $('#' + name + ' select option[value="' + den + '"]').val(id).text(label);

                            // replace the temporary id in the model with the new assigned id
                            const selectedValues = this.model[name].split(',');

                            const i = _.indexOf(selectedValues, _.find(selectedValues, den));
                            selectedValues.splice(i, 1, id);

                            this.model[name] = selectedValues.join(',');


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


/*
    createTag(type: string, name: string) {
        let data = {'denominazione': name};
        this.apiService.create(type, data)
            .subscribe(
                data => {
                    console.log(data);
                },
                error => {
                    this.error = error; console.log(error);
                });
    }
*/

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
