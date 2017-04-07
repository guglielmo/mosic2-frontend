import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,
  ReactiveFormsModule }      from '@angular/forms';

import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-modal';
import { StickTheadModule } from '../_directives/stickthead/stickthead.module';
import { DataTableModule } from 'angular2-datatable';
import { AmministrazioniDataFilterPipe }   from '../_pipes/index';
import { PipesDirectivesSharedModule } from '../_shared/index';

import { AmministrazioniListComponent } from './list/amministrazioni-list.component';
import { AmministrazioniEditComponent } from './edit/amministrazioni-edit.component';

import { WidgetModule } from '../layout/widget/widget.module';

export const routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: AmministrazioniListComponent},
  {path: 'edit', component: AmministrazioniEditComponent},
  {path: 'edit/:id', component: AmministrazioniEditComponent},
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
    PipesDirectivesSharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
      AmministrazioniListComponent,
      AmministrazioniEditComponent,
      AmministrazioniDataFilterPipe
  ]
})
export class AmministrazioniModule {
  static routes = routes;
}
