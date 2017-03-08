import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,
  ReactiveFormsModule }      from '@angular/forms';

import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-modal';
import { StickTheadModule } from '../_directives/stickthead/stickthead.module';
import { DataTableModule } from 'angular2-datatable';
import { TagsDataFilterPipe,
  TagsDataMarkPipe }   from '../_pipes/index';

import { TagsListComponent } from './list/tags-list.component';
import { TagsEditComponent } from './edit/tags-edit.component';

import { WidgetModule } from '../layout/widget/widget.module';

export const routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: TagsListComponent},
  {path: 'edit', component: TagsEditComponent},
  {path: 'edit/:id', component: TagsEditComponent},
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
      TagsListComponent,
      TagsEditComponent,
      TagsDataFilterPipe,
      TagsDataMarkPipe
  ]
})
export default class TagsModule {
  static routes = routes;
}
