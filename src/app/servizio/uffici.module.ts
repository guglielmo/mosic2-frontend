import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,
  ReactiveFormsModule }      from '@angular/forms';

import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-modal';
import { StickTheadModule } from '../_directives/stickthead/stickthead.module';
import { DataTableModule } from 'angular2-datatable';
import { UfficiDataFilterPipe,
  UfficiDataMarkPipe }   from '../_pipes/index';

import { UfficiListComponent } from './list/uffici-list.component';
import { UfficiEditComponent } from './edit/uffici-edit.component';

import { WidgetModule } from '../layout/widget/widget.module';

export const routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: UfficiListComponent},
  {path: 'edit', component: UfficiEditComponent},
  {path: 'edit/:id', component: UfficiEditComponent},
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
      UfficiListComponent,
      UfficiEditComponent,
      UfficiDataFilterPipe,
      UfficiDataMarkPipe
  ]
})
export default class UfficiModule {
  static routes = routes;
}
