import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,
  ReactiveFormsModule }      from '@angular/forms';

import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-modal';

import { DataTableModule } from 'angular2-datatable';
import { TagsDataFilterPipe }   from '../_pipes/index';
import { PipesDirectivesSharedModule } from '../_shared/index'

import { TagsListComponent } from './list/tags-list.component';
import { TagsEditComponent } from './edit/tags-edit.component';

export const routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: TagsListComponent},
  {path: 'edit', component: TagsEditComponent},
  {path: 'edit/:id', component: TagsEditComponent},
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    ModalModule,

    DataTableModule,
    PipesDirectivesSharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
      TagsListComponent,
      TagsEditComponent,
      TagsDataFilterPipe,
  ]
})
export class TagsModule {
  static routes = routes;
}
