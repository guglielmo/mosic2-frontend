import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,
  ReactiveFormsModule }      from '@angular/forms';

import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-modal';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { DataTableModule } from 'angular2-datatable';
import { PipesDirectivesSharedModule } from '../_shared/index'
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import * as highcharts from 'highcharts'

export function highchartsFactory() {
  return highcharts;
}

import { MonitorListComponent } from './list/monitor-list.component';

export const routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: ':viewtype', component: MonitorListComponent},
  {path: ':viewtype/:dateFilter', component: MonitorListComponent},
];




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonsModule,
    ModalModule,
    AccordionModule.forRoot(),
    DataTableModule,
    PipesDirectivesSharedModule,
    TooltipModule.forRoot(),
    ChartModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
      MonitorListComponent
  ],
  providers: [
    {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
    }
  ]
})
export class MonitorModule {
  static routes = routes;
}
