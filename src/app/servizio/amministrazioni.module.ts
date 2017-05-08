import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,
  ReactiveFormsModule }      from '@angular/forms';

import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-modal';

import { DataTableModule } from 'angular2-datatable';
import { PipesDirectivesSharedModule } from '../_shared/index';

import { AmministrazioniListComponent } from './list/amministrazioni-list.component';
import { AmministrazioniEditComponent } from './edit/amministrazioni-edit.component';

export const routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: AmministrazioniListComponent},
  {path: 'edit', component: AmministrazioniEditComponent},
  {path: 'edit/:id', component: AmministrazioniEditComponent},
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
      AmministrazioniListComponent,
      AmministrazioniEditComponent
  ]
})
export class AmministrazioniModule {
  static routes = routes;
}
