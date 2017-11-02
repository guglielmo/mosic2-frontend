import { NgModule }                             from '@angular/core';
import { CommonModule }                         from '@angular/common';
import { FormsModule, ReactiveFormsModule }     from '@angular/forms';

import { RouterModule }                         from '@angular/router';

import { ModalModule }                          from 'ngx-modal';
import { DataTableModule }                      from 'angular2-datatable';

import { PipesDirectivesSharedModule }          from '../_shared/index'
import { Select2Module } from 'ng2-select2';
import { AccordionModule } from 'ngx-bootstrap/accordion';



import { TitolariListComponent }                from './list/titolari-list.component';
import { TitolariEditComponent }                from './edit/titolari-edit.component';


export const routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: TitolariListComponent},
  {path: 'edit', component: TitolariEditComponent},
  {path: 'edit/:id', component: TitolariEditComponent},
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module,
    ModalModule,
    AccordionModule.forRoot(),
    DataTableModule,
    PipesDirectivesSharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
      TitolariListComponent,
      TitolariEditComponent
  ]
})
export class TitolariModule {
  static routes = routes;
}
