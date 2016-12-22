import { Routes, RouterModule }  from '@angular/router';
import { Layout } from './layout.component';
import { AuthGuard }                from '../_guards/auth.guard';


// noinspection TypeScriptValidateTypes
const routes: Routes = [
  { path: '', component: Layout, children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', loadChildren: () => System.import('../dashboard/dashboard.module'), canActivate: [AuthGuard] },
    { path: 'titolari', loadChildren: () => System.import('../titolari/titolari.module'), canActivate: [AuthGuard] },
    { path: 'fascicoli', loadChildren: () => System.import('../fascicoli/fascicoli.module'), canActivate: [AuthGuard] },
    { path: 'registri', loadChildren: () => System.import('../registri/registri.module'), canActivate: [AuthGuard] },
    { path: 'users', loadChildren: () => System.import('../users/users.module'), canActivate: [AuthGuard] }
  ]}
];

export const ROUTES = RouterModule.forChild(routes);
