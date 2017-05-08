import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LOCALE_ID } from '@angular/core';

import { ModalModule } from 'ngx-modal';

import { DataTableModule } from 'angular2-datatable';
import { PipesDirectivesSharedModule } from '../_shared/index';
import { Select2Module } from 'ng2-select2';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { TooltipModule } from 'ng2-bootstrap/tooltip';
import { AccordionModule } from 'ng2-bootstrap/accordion';
import { ScrollToModule } from 'ng2-scroll-to-el';

// ngx-uploader
import { NgUploaderModule } from 'ngx-uploader';
import { TabsModule } from 'ng2-bootstrap/tabs';

import { DelibereListComponent } from './list/delibere-list.component';
import { DelibereEditComponent } from './edit/delibere-edit.component';
import { DelibereIterComponent } from './edit/delibere-iter.component';
import { DelibereRilievoComponent } from './edit/delibere-rilievo.component';
import { DelibereUploadComponent } from './edit/delibere-upload.component';

export const routes = [
    {path: '', redirectTo: 'list', pathMatch: 'full'},
    {path: 'list', component: DelibereListComponent},
    {path: 'edit', component: DelibereEditComponent},
    {path: 'edit/:id', component: DelibereEditComponent}
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        ModalModule,
        DataTableModule,

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
