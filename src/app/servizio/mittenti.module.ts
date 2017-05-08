import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,
  ReactiveFormsModule }      from '@angular/forms';

import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-modal';

import { DataTableModule } from 'angular2-datatable';
import { MittentiDataFilterPipe }   from '../_pipes/index';
import { PipesDirectivesSharedModule } from '../_shared/index';

import { MittentiListComponent } from './list/mittenti-list.component';
import { MittentiEditComponent } from './edit/mittenti-edit.component';

export const routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: MittentiListComponent},
  {path: 'edit', component: MittentiEditComponent},
  {path: 'edit/:id', component: MittentiEditComponent},
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
      MittentiListComponent,
      MittentiEditComponent,
      MittentiDataFilterPipe
  ]
})
export class MittentiModule {
  static routes = routes;
}
