import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,
  ReactiveFormsModule }      from '@angular/forms';

import { RouterModule } from '@angular/router';

import { ModalModule } from 'ng2-modal';
import { StickTheadModule } from '../_directives/stickthead/stickthead.module';
import { DataTableModule } from 'angular2-datatable';

import 'select2/dist/js/select2.full.js';
import { Select2Module } from 'ng2-select2';

// datetime picker
import 'bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js';
import 'bootstrap-datepicker/dist/locales/bootstrap-datepicker.it.min.js';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';

import { FascicoliListComponent } from './list/fascicoli-list.component';
import { FascicoliCreateComponent } from './edit/fascicoli-edit.component';

import { WidgetModule } from '../layout/widget/widget.module';

export const routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: FascicoliListComponent},
  {path: 'create', component: FascicoliCreateComponent},
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
    NKDatetimeModule,
    Select2Module,

    RouterModule.forChild(routes)
  ],
  declarations: [
      FascicoliListComponent,
      FascicoliCreateComponent
  ]
})
export default class TitolariModule {
  static routes = routes;
}
