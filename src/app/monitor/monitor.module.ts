import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,
  ReactiveFormsModule }      from '@angular/forms';

import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-modal';

import { DataTableModule } from 'angular2-datatable';
import { PipesDirectivesSharedModule } from '../_shared/index'
import { AccordionModule } from 'ngx-bootstrap/accordion';

import { MonitorListComponent } from './list/monitor-list.component';

export const routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'situazione', component: MonitorListComponent},
  {path: 'statistica', component: MonitorListComponent},
  {path: 'analisi', component: MonitorListComponent}

];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    ModalModule,
    AccordionModule.forRoot(),
    DataTableModule,
    PipesDirectivesSharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
      MonitorListComponent
  ]
})
export class MonitorModule {
  static routes = routes;
}
