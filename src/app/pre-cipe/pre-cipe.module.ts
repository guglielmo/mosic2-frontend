import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,
  ReactiveFormsModule }      from '@angular/forms';

import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-modal';
import { StickTheadModule } from '../_directives/stickthead/stickthead.module';
import { DataTableModule } from 'angular2-datatable';

import { PreCipeListComponent } from './list/pre-cipe-list.component';
import { PreCipeEditComponent } from './edit/pre-cipe-edit.component';

import { WidgetModule } from '../layout/widget/widget.module';

import {DndModule} from 'ng2-dnd';


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

    DndModule.forRoot(),

    RouterModule.forChild(routes)
  ],
  declarations: [
      PreCipeListComponent,
      PreCipeEditComponent
  ]
})
export default class PreCipeModule {
  static routes = routes;
}
