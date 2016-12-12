import { NgModule }                 from '@angular/core';
import { CommonModule }             from '@angular/common';
import { FormsModule,
         ReactiveFormsModule }      from '@angular/forms';

import { p404Component }            from './404.component';
import { p500Component }            from './500.component';
import { LoginComponent }           from './login.component';
import { RegisterComponent }        from './register.component';

import { PagesRoutingModule }       from './pages-routing.module';


@NgModule({
    imports: [
        PagesRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule
    ],
    declarations: [
        p404Component,
        p500Component,
        LoginComponent,
        RegisterComponent
    ],
    providers: [

    ]
})
export class PagesModule { }
