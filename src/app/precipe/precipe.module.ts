
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LOCALE_ID } from '@angular/core';

import { ModalModule } from 'ngx-modal';

import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { DataTableModule } from 'angular2-datatable';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PipesDirectivesSharedModule } from '../_shared/index';
import { DragulaModule } from 'ng2-dragula';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AccordionModule } from 'ngx-bootstrap/accordion';
/*
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
*/
import { Select2Module } from 'ng2-select2';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { ScrollToModule } from 'ng2-scroll-to-el';


// ngx-uploader
import { NgUploaderModule } from 'ngx-uploader';

import { PreCipeListComponent } from './list/precipe-list.component';
import { PreCipeEditComponent } from './edit/precipe-edit.component';
import { PreCipeOdgItemComponent } from './edit/precipe-odg-item.component';
import { PreCipeUploadComponent } from './edit/precipe-upload.component';
import {DataEnumPipe} from "../_pipes/data-enum.pipe";



export const routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: PreCipeListComponent},
  {path: 'edit', component: PreCipeEditComponent},
  {path: 'edit/:id', component: PreCipeEditComponent},
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
    /*ProgressbarModule.forRoot(),*/
    ScrollToModule.forRoot(),
    NgUploaderModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "it-IT" }
  ],
  declarations: [
      PreCipeListComponent,
      PreCipeEditComponent,
      PreCipeOdgItemComponent,
      PreCipeUploadComponent
  ]
})
export class PreCipeModule {
  static routes = routes;
}
