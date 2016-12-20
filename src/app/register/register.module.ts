import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,
    ReactiveFormsModule }      from '@angular/forms';

import { RouterModule } from '@angular/router';

import { ModalModule } from 'ng2-modal';
import { StickTheadModule } from '../_directives/stickthead/stickthead.module';
import { DataTableModule } from 'angular2-datatable';
import { Select2Component } from 'ng2-select2';

// datetime picker
import 'bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js';
import 'bootstrap-datepicker/dist/locales/bootstrap-datepicker.it.min.js';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';

import {RegisterListComponent}       from './list/register-list.component';
import {RegisterCreateComponent}       from './edit/register-edit.component';

export const routes = [
    {path: '', redirectTo: 'list', pathMatch: 'full'},
    {path: 'list', component: RegisterListComponent},
    {path: 'create', component: RegisterCreateComponent},
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

        RouterModule.forChild(routes)
    ],
    declarations: [
        Select2Component,
        RegisterListComponent,
        RegisterCreateComponent
    ]
})
export default class RegisterModule {
    static routes = routes;
}
