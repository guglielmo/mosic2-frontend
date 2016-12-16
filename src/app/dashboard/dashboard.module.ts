import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';

import { RouterModule } from '@angular/router';
import { Dashboard } from './dashboard.component.ts';
import { WidgetModule } from '../layout/widget/widget.module';

export const routes = [
  { path: '', component: Dashboard, pathMatch: 'full' }
];


@NgModule({
  imports: [ CommonModule, WidgetModule, RouterModule.forChild(routes) ],
  declarations: [ Dashboard ]
})
export default class DashboardModule {
  static routes = routes;
}
