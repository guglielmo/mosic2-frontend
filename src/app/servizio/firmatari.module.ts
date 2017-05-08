import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,
  ReactiveFormsModule }      from '@angular/forms';

import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-modal';

import { DataTableModule } from 'angular2-datatable';
import { PipesDirectivesSharedModule } from '../_shared/index';
import { Select2Module } from 'ng2-select2';

import { FirmatariListComponent } from './list/firmatari-list.component';
import { FirmatariEditComponent } from './edit/firmatari-edit.component';

export const routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: FirmatariListComponent},
  {path: 'edit', component: FirmatariEditComponent},
  {path: 'edit/:id', component: FirmatariEditComponent},
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module,
    ModalModule,

    DataTableModule,
    PipesDirectivesSharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
      FirmatariListComponent,
      FirmatariEditComponent
  ]
})
export class FirmatariModule {
  static routes = routes;
}
