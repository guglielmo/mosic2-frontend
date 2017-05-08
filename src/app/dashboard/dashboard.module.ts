import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { PipesDirectivesSharedModule } from '../_shared/index';


export const routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' }
];


@NgModule({
  imports: [
    CommonModule,
    PipesDirectivesSharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ DashboardComponent ]
})
export class DashboardModule {
  static routes = routes;
}
