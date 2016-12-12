import { NgModule}             from '@angular/core';
import { Routes,
         RouterModule }       from '@angular/router';

import { UsersListComponent }   from './users-list.component';
import { UserCreateComponent }   from './user-create.component';


const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Utenti'
        },

        children: [
            {
                path: 'list',
                component: UsersListComponent,
                data: {
                    title: 'Lista'
                }
            },
            {
                path: 'create',
                component: UserCreateComponent,
                data: {
                    title: 'Nuovo utente'
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class UsersRoutingModule {}
