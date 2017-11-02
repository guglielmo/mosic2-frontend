import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-modal';

import { DataTableModule } from 'angular2-datatable';
import { PipesDirectivesSharedModule } from '../_shared/index';
import { Select2Module } from 'ng2-select2';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { LOCALE_ID } from '@angular/core';


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
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  declarations: [
      FascicoliListComponent,
      FascicoliEditComponent
  ],
  providers: [
      { provide: LOCALE_ID, useValue: "it-IT" }
  ],
})
export class FascicoliModule {
  static routes = routes;
}
