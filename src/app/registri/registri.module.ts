import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,
         ReactiveFormsModule }      from '@angular/forms';

import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-modal';
import { StickTheadModule } from '../_directives/stickthead/stickthead.module';
import { DataTableModule } from 'angular2-datatable';


import { RegistriDataFilterPipe,
         RegistriDataMarkPipe,
         FascicoliByTitolarioDataFilterPipe,
         FileSizePipe }   from '../_pipes/index';

import 'select2/dist/js/select2.full.js';
import { Select2Module } from 'ng2-select2';

// datetime picker
import 'bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js';
import 'bootstrap-datepicker/dist/locales/bootstrap-datepicker.it.min.js';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';

import {RegistriListComponent}       from './list/registri-list.component';
import {RegistriEditComponent}       from './edit/registri-edit.component';

import { WidgetModule } from '../layout/widget/widget.module';

// ngx-uploader
import { NgUploaderModule } from 'ngx-uploader';


export const routes = [
    {path: '', redirectTo: 'list', pathMatch: 'full'},
    {path: 'list', component: RegistriListComponent},
    {path: 'edit', component: RegistriEditComponent},
    {path: 'edit/:id', component: RegistriEditComponent}
];

@NgModule({
    imports: [
        CommonModule,
        WidgetModule,
        FormsModule,
        ReactiveFormsModule,

        ModalModule,
        DataTableModule,
        StickTheadModule,
        NKDatetimeModule,
        Select2Module,
        NgUploaderModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        RegistriListComponent,
        RegistriEditComponent,
        RegistriDataFilterPipe,
        RegistriDataMarkPipe,
        FascicoliByTitolarioDataFilterPipe,
        FileSizePipe
    ]
})
export default class RegistriModule {
    static routes = routes;
}
