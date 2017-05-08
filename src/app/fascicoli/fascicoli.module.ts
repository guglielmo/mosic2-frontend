import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-modal';

import { DataTableModule } from 'angular2-datatable';
import { PipesDirectivesSharedModule } from '../_shared/index';
import { Select2Module } from 'ng2-select2';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { TooltipModule } from 'ng2-bootstrap/tooltip';


import { FascicoliListComponent } from './list/fascicoli-list.component';
import { FascicoliEditComponent } from './edit/fascicoli-edit.component';


export const routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: FascicoliListComponent},
  {path: 'edit', component: FascicoliEditComponent},
  {path: 'edit/:id', component: FascicoliEditComponent}
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    ModalModule,

    DataTableModule,
    NKDatetimeModule,
    Select2Module,
    PipesDirectivesSharedModule,
    TooltipModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  declarations: [
      FascicoliListComponent,
      FascicoliEditComponent
  ]
})
export class FascicoliModule {
  static routes = routes;
}
