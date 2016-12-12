import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule,
         ReactiveFormsModule }      from '@angular/forms';

import {UsersListComponent}       from './users-list.component';
import {UserCreateComponent}       from './user-create.component';


import {UsersRoutingModule}   from './users-routing.module';

@NgModule({
    imports: [
        UsersRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        UsersListComponent,
        UserCreateComponent
    ]
})
export class UsersModule { }