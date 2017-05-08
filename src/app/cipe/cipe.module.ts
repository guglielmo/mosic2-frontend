
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LOCALE_ID } from '@angular/core';

import { ModalModule } from 'ngx-modal';

import { ButtonsModule } from 'ng2-bootstrap/buttons';
import { DataTableModule } from 'angular2-datatable';
import { TooltipModule } from 'ng2-bootstrap/tooltip';
import { PipesDirectivesSharedModule } from '../_shared/index';
import { DragulaModule } from 'ng2-dragula';
import { TabsModule } from 'ng2-bootstrap/tabs';
import { AccordionModule } from 'ng2-bootstrap/accordion';
import { Select2Module } from 'ng2-select2';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { ScrollToModule } from 'ng2-scroll-to-el';


// ngx-uploader
import { NgUploaderModule } from 'ngx-uploader';

import { CipeListComponent } from './list/cipe-list.component';
import { CipeEditComponent } from './edit/cipe-edit.component';
import { CipeOdgItemComponent } from './edit/cipe-odg-item.component';
import { CipeUploadComponent } from './edit/cipe-upload.component';
import {DataEnumPipe} from "../_pipes/data-enum.pipe";



export const routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: CipeListComponent},
  {path: 'edit', component: CipeEditComponent},
  {path: 'edit/:id', component: CipeEditComponent},
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    ModalModule,

    ButtonsModule,
    DataTableModule,
    TooltipModule.forRoot(),
    Select2Module,
    NKDatetimeModule,
    PipesDirectivesSharedModule,
    DragulaModule,
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    ScrollToModule.forRoot(),
    NgUploaderModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "it-IT" }
  ],
  declarations: [
      CipeListComponent,
      CipeEditComponent,
      CipeOdgItemComponent,
      CipeUploadComponent
  ]
})
export class CipeModule {
  static routes = routes;
}
