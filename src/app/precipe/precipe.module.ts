import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-modal';
import { StickTheadModule } from '../_directives/stickthead/stickthead.module';
import { DataTableModule } from 'angular2-datatable';
import { PipesSharedModule } from '../_shared/index';
import { DragulaModule } from 'ng2-dragula';
import { TabsModule } from 'ng2-bootstrap/tabs';
import { AccordionModule } from 'ng2-bootstrap/accordion';
import { BsDropdownModule } from 'ng2-bootstrap/dropdown';


import { WidgetModule } from '../layout/widget/widget.module';

import { Select2Module } from 'ng2-select2';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';

// ngx-uploader
import { NgUploaderModule } from 'ngx-uploader';

import { PreCipeListComponent } from './list/precipe-list.component';
import { PreCipeEditComponent } from './edit/precipe-edit.component';

export const routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: PreCipeListComponent},
  {path: 'edit', component: PreCipeEditComponent},
  {path: 'edit/:id', component: PreCipeEditComponent},
];


@NgModule({
  imports: [
    CommonModule,
    WidgetModule,
    FormsModule,
    ReactiveFormsModule,

    ModalModule,
    StickTheadModule,
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
  declarations: [
      PreCipeListComponent,
      PreCipeEditComponent
  ]
})
export class PreCipeModule {
  static routes = routes;
}
