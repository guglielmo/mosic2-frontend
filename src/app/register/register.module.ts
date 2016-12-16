import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,
    ReactiveFormsModule }      from '@angular/forms';

import { RouterModule } from '@angular/router';

import { Autosize } from 'angular2-autosize';
import { ModalModule } from 'ng2-modal';
import { StickTheadModule } from '../_directives/stickthead/stickthead.module';
import { DataTableModule } from 'angular2-datatable';
import { MyDatePickerModule }      from 'mydatepicker';
import { Select2Component } from 'ng2-select2';

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
        MyDatePickerModule,

        RouterModule.forChild(routes)
    ],
    declarations: [
        Autosize,
        Select2Component,
        RegisterListComponent,
        RegisterCreateComponent
    ]
})
export default class RegisterModule {
    static routes = routes;
}
