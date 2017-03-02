import {NgModule}      from '@angular/core';
import {CommonModule}  from '@angular/common';
import {
    FormsModule,
    ReactiveFormsModule
}      from '@angular/forms';

import {RouterModule} from '@angular/router';

import {ModalModule} from 'ngx-modal';
import {StickTheadModule} from '../_directives/stickthead/stickthead.module';
import {DataTableModule} from 'angular2-datatable';

import {UsersListComponent}       from './list/users-list.component';
import {UserEditComponent}       from './edit/user-edit.component';

export const routes = [
    {path: '', redirectTo: 'list', pathMatch: 'full'},
    {path: 'list', component: UsersListComponent},
    {path: 'edit', component: UserEditComponent},
    {path: 'edit/:id', component: UserEditComponent},
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule,
        DataTableModule,
        StickTheadModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        UsersListComponent,
        UserEditComponent
    ]
})
export default class UsersModule {
    static routes = routes;
}
