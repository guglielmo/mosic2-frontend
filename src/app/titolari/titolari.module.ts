import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,
  ReactiveFormsModule }      from '@angular/forms';

import { RouterModule } from '@angular/router';

import { ModalModule } from 'ng2-modal';
import { StickTheadModule } from '../_directives/stickthead/stickthead.module';
import { DataTableModule } from 'angular2-datatable';

import { TitolariListComponent } from './list/titolari-list.component';
import { TitolariCreateComponent } from './edit/titolari-edit.component';

import { WidgetModule } from '../layout/widget/widget.module';

export const routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: TitolariListComponent},
  {path: 'create', component: TitolariCreateComponent},
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
      TitolariCreateComponent
  ]
})
export default class TitolariModule {
  static routes = routes;
}
