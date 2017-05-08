import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,
  ReactiveFormsModule }      from '@angular/forms';

import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-modal';

import { DataTableModule } from 'angular2-datatable';
import { PipesDirectivesSharedModule } from '../_shared/index';

import { UfficiListComponent } from './list/uffici-list.component';
import { UfficiEditComponent } from './edit/uffici-edit.component';

export const routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: UfficiListComponent},
  {path: 'edit', component: UfficiEditComponent},
  {path: 'edit/:id', component: UfficiEditComponent},
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
      UfficiListComponent,
      UfficiEditComponent,
  ]
})
export class UfficiModule {
  static routes = routes;
}
