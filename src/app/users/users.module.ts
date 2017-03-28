import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {RouterModule} from '@angular/router';

import {ModalModule} from 'ngx-modal';
import {StickTheadModule} from '../_directives/stickthead/stickthead.module';
import {DataTableModule} from 'angular2-datatable';

import { PipesSharedModule } from '../_shared/index';


import {UsersListComponent} from './list/users-list.component';
import {UserEditComponent} from './edit/user-edit.component';

import {GroupsListComponent} from './list/groups-list.component';
import {GroupsEditComponent} from './edit/groups-edit.component';

import {RuoliCipeListComponent} from './list/ruoli_cipe-list.component';
import {RuoliCipeEditComponent} from './edit/ruoli_cipe-edit.component';

export const routes = [
    {path: '', redirectTo: 'list', pathMatch: 'full'},
    {path: 'list', component: UsersListComponent},
    {path: 'edit', component: UserEditComponent},
    {path: 'edit/:id', component: UserEditComponent},
    {path: 'groups/list', component: GroupsListComponent},
    {path: 'groups/edit', component: GroupsEditComponent},
    {path: 'groups/edit/:id', component: GroupsEditComponent},
    {path: 'ruoli_cipe/list', component: RuoliCipeListComponent},
    {path: 'ruoli_cipe/edit', component: RuoliCipeEditComponent},
    {path: 'ruoli_cipe/edit/:id', component: RuoliCipeEditComponent},
];

import { Select2Module } from 'ng2-select2';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule,
        DataTableModule,
        StickTheadModule,
        Select2Module,
        PipesSharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        UsersListComponent,
        UserEditComponent,
        GroupsListComponent,
        GroupsEditComponent,
        RuoliCipeListComponent,
        RuoliCipeEditComponent
    ]
})
export class UsersModule {
    static routes = routes;
}
