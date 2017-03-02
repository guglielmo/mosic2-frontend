import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,
  ReactiveFormsModule }      from '@angular/forms';

import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-modal';
import { StickTheadModule } from '../_directives/stickthead/stickthead.module';
import { DataTableModule } from 'angular2-datatable';

import { TitolariListComponent } from './list/titolari-list.component';
import { TitolariEditComponent } from './edit/titolari-edit.component';

import { WidgetModule } from '../layout/widget/widget.module';

export const routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: TitolariListComponent},
  {path: 'edit', component: TitolariEditComponent},
  {path: 'edit/:id', component: TitolariEditComponent},
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

    RouterModule.forChild(routes)
  ],
  declarations: [
      TitolariListComponent,
      TitolariEditComponent
  ]
})
export default class TitolariModule {
  static routes = routes;
}
