import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,
  ReactiveFormsModule }      from '@angular/forms';

import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-modal';
import { StickTheadModule } from '../_directives/stickthead/stickthead.module';
import { DataTableModule } from 'angular2-datatable';
import { MittentiDataFilterPipe,
  MittentiDataMarkPipe }   from '../_pipes/index';

import { MittentiListComponent } from './list/mittenti-list.component';
import { MittentiEditComponent } from './edit/mittenti-edit.component';

import { WidgetModule } from '../layout/widget/widget.module';

export const routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: MittentiListComponent},
  {path: 'edit', component: MittentiEditComponent},
  {path: 'edit/:id', component: MittentiEditComponent},
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
      MittentiListComponent,
      MittentiEditComponent,
      MittentiDataFilterPipe,
      MittentiDataMarkPipe
  ]
})
export default class MittentiModule {
  static routes = routes;
}