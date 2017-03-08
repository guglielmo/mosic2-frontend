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
    { path: 'pre-cipe', loadChildren: () => System.import('../pre-cipe/pre-cipe.module'), canActivate: [AuthGuard] },
    { path: 'users', loadChildren: () => System.import('../users/users.module'), canActivate: [AuthGuard] },
    { path: 'mittenti', loadChildren: () => System.import('../servizio/mittenti.module.ts'), canActivate: [AuthGuard] },
    { path: 'amministrazioni', loadChildren: () => System.import('../servizio/amministrazioni.module.ts'), canActivate: [AuthGuard] },
    { path: 'uffici', loadChildren: () => System.import('../servizio/uffici.module.ts'), canActivate: [AuthGuard] },
    { path: 'tags', loadChildren: () => System.import('../servizio/tags.module.ts'), canActivate: [AuthGuard] }
  ]}
];

export const ROUTES = RouterModule.forChild(routes);
