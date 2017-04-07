
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LOCALE_ID } from '@angular/core';

import { ModalModule } from 'ngx-modal';
import { StickTheadModule } from '../_directives/stickthead/stickthead.module';
import { DisableFormControlModule } from '../_directives/disable-formcontrol/disable-formcontrol.module';
import { DataTableModule } from 'angular2-datatable';
import { PipesSharedModule } from '../_shared/index';
import { DragulaModule } from 'ng2-dragula';
import { TabsModule } from 'ng2-bootstrap/tabs';
import { AccordionModule } from 'ng2-bootstrap/accordion';
import { BsDropdownModule } from 'ng2-bootstrap/dropdown';
import { Autosize } from 'angular2-autosize/src/autosize.directive';


import { WidgetModule } from '../layout/widget/widget.module';

import { Select2Module } from 'ng2-select2';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';

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
    WidgetModule,
    FormsModule,
    ReactiveFormsModule,

    ModalModule,
    StickTheadModule,
    DisableFormControlModule,
    DataTableModule,
    Select2Module,
    NKDatetimeModule,
    PipesSharedModule,
    DragulaModule,
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    BsDropdownModule.forRoot(),
    NgUploaderModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "it-IT" }
  ],
  declarations: [
      Autosize,
      CipeListComponent,
      CipeEditComponent,
      CipeOdgItemComponent,
      CipeUploadComponent
  ]
})
export class CipeModule {
  static routes = routes;
}
