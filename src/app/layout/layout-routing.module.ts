import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_guards/auth.guard';
import { LayoutComponent } from './layout.component';

export const routes: Routes = [
    { path: '', component: LayoutComponent, children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', loadChildren: '../dashboard/dashboard.module#DashboardModule', canActivate: [AuthGuard] },
        { path: 'titolari', loadChildren: '../titolari/titolari.module#TitolariModule', canActivate: [AuthGuard] },
        { path: 'fascicoli', loadChildren: '../fascicoli/fascicoli.module#FascicoliModule', canActivate: [AuthGuard] },
        { path: 'registri', loadChildren: '../registri/registri.module#RegistriModule', canActivate: [AuthGuard] },
        { path: 'precipe', loadChildren: '../precipe/precipe.module#PreCipeModule', canActivate: [AuthGuard] },
        { path: 'cipe', loadChildren: '../cipe/cipe.module#CipeModule', canActivate: [AuthGuard] },
        { path: 'delibere', loadChildren: '../delibere/delibere.module#DelibereModule', canActivate: [AuthGuard] },
        { path: 'adempimenti', loadChildren: '../adempimenti/adempimenti.module#AdempimentiModule', canActivate: [AuthGuard] },
        { path: 'monitor', loadChildren: '../monitor/monitor.module#MonitorModule', canActivate: [AuthGuard] },
        { path: 'users', loadChildren: '../users/users.module#UsersModule', canActivate: [AuthGuard] },
        { path: 'mittenti', loadChildren: '../servizio/mittenti.module#MittentiModule', canActivate: [AuthGuard] },
        { path: 'amministrazioni', loadChildren: '../servizio/amministrazioni.module#AmministrazioniModule', canActivate: [AuthGuard] },
        { path: 'uffici', loadChildren: '../servizio/uffici.module#UfficiModule', canActivate: [AuthGuard] },
        { path: 'tags', loadChildren: '../servizio/tags.module#TagsModule', canActivate: [AuthGuard] },
        { path: 'firmatari', loadChildren: '../servizio/firmatari.module#FirmatariModule', canActivate: [AuthGuard] },
        { path: ':apipath', loadChildren: '../abstract/abstract.module#AbstractModule', canActivate: [AuthGuard] }
    ]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class LayoutRoutingModule { }
