import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,
  ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-modal';

import { DataTableModule } from 'angular2-datatable';
import { Select2Module } from 'ng2-select2';
import { PipesDirectivesSharedModule } from '../_shared/index';

import { AbstractListComponent } from './list/abstract-list.component';
import { AbstractEditComponent } from './edit/abstract-edit.component';


export const routes = [
    {path: 'list', component: AbstractListComponent},
    {path: 'edit', component: AbstractEditComponent},
    {path: 'edit/:id', component: AbstractEditComponent},
];


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        ModalModule,
        Select2Module,
        DataTableModule,
        PipesDirectivesSharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        AbstractListComponent,
        AbstractEditComponent
    ]
})
export class AbstractModule {
    static routes = routes;
}
