import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LOCALE_ID } from '@angular/core';

import { ModalModule } from 'ngx-modal';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { DataTableModule } from 'angular2-datatable';
import { PipesDirectivesSharedModule } from '../_shared/index';
import { Select2Module } from 'ng2-select2';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ScrollToModule } from 'ng2-scroll-to-el';

// ngx-uploader
import { AdempimentiListComponent } from './list/adempimenti-list.component';
import { AdempimentiEditComponent } from './edit/adempimenti-edit.component';
import { AdempimentiScadenzeComponent } from './edit/adempimenti-scadenze.component'

export const routes = [
    {path: '', redirectTo: 'list', pathMatch: 'full'},
    {path: 'list', component: AdempimentiListComponent},
    {path: 'edit', component: AdempimentiEditComponent},
    {path: 'edit/:id', component: AdempimentiEditComponent}
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule,
        DataTableModule,
        ButtonsModule,
        NKDatetimeModule,
        Select2Module,
        PipesDirectivesSharedModule,
        AccordionModule.forRoot(),
        ScrollToModule.forRoot(),
        TooltipModule.forRoot(),
        RouterModule.forChild(routes)
    ],
    providers: [
        { provide: LOCALE_ID, useValue: "it-IT" }
    ],
    declarations: [
        AdempimentiListComponent,
        AdempimentiEditComponent,
        AdempimentiScadenzeComponent
    ]
})
export class AdempimentiModule {
    static routes = routes;
}
