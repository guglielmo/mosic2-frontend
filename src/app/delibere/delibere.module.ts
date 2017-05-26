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
import { NgUploaderModule } from 'ngx-uploader';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { DelibereListComponent } from './list/delibere-list.component';
import { DelibereEditComponent } from './edit/delibere-edit.component';
import { DelibereIterComponent } from './edit/delibere-iter.component';
import { DelibereRilievoComponent } from './edit/delibere-rilievo.component';
import { DelibereUploadComponent } from './edit/delibere-upload.component';

export const routes = [
    {path: '', redirectTo: 'list', pathMatch: 'full'},
    {path: 'edit', component: DelibereEditComponent},
    {path: 'edit/:id', component: DelibereEditComponent},
    {path: ':viewtype', component: DelibereListComponent},
    {path: ':viewtype/:dateFilter', component: DelibereListComponent}
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
        NgUploaderModule,
        PipesDirectivesSharedModule,
        AccordionModule.forRoot(),
        ScrollToModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        RouterModule.forChild(routes)
    ],
    providers: [
        { provide: LOCALE_ID, useValue: "it-IT" }
    ],
    declarations: [
        DelibereListComponent,
        DelibereEditComponent,
        DelibereIterComponent,
        DelibereRilievoComponent,
        DelibereUploadComponent

    ]
})
export class DelibereModule {
    static routes = routes;
}
