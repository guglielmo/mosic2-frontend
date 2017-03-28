import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';


export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'app'
    },
    {
        path: 'app',
        loadChildren: './layout/layout.module#LayoutModule'
    },
    {
        path: 'login',
        loadChildren: './login/login.module#LoginModule'
    },
    {
        path: 'signup',
        loadChildren: './signup/signup.module#SignupModule'
    },
    {
        path: 'error',
        loadChildren: './error/error.module#ErrorModule'
    },
    {
        path: '**',
        redirectTo: 'error'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule { }
