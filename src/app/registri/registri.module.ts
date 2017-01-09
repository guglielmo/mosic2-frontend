import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,
    ReactiveFormsModule }      from '@angular/forms';

import { RouterModule } from '@angular/router';

import { ModalModule } from 'ng2-modal';
import { StickTheadModule } from '../_directives/stickthead/stickthead.module';
import { DataTableModule } from 'angular2-datatable';

//import 'moment/moment.js';

import 'select2/dist/js/select2.full.js';
import { Select2Module } from 'ng2-select2';

import { DropzoneModule } from 'angular2-dropzone-wrapper';
import { DropzoneConfigInterface } from 'angular2-dropzone-wrapper';

const DROPZONE_CONFIG: DropzoneConfigInterface = {
    // Change this to your upload POST address:
    server: 'https://httpbin.org/post',
    maxFilesize: 50
};

// datetime picker
import 'bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js';
import 'bootstrap-datepicker/dist/locales/bootstrap-datepicker.it.min.js';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';

import {RegistriListComponent}       from './list/registri-list.component';
import {RegistriEditComponent}       from './edit/registri-edit.component';

export const routes = [
    {path: '', redirectTo: 'list', pathMatch: 'full'},
    {path: 'list', component: RegistriListComponent},
    {path: 'edit', component: RegistriEditComponent},
    {path: 'edit/:id', component: RegistriEditComponent}
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        ModalModule,
        DataTableModule,
        StickTheadModule,
        NKDatetimeModule,
        Select2Module,
        DropzoneModule.forRoot(DROPZONE_CONFIG),
        RouterModule.forChild(routes)
    ],
    declarations: [
        RegistriListComponent,
        RegistriEditComponent
    ]
})
export default class RegistriModule {
    static routes = routes;
}
