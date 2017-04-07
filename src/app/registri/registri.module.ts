import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-modal';
import { StickTheadModule } from '../_directives/stickthead/stickthead.module';
import { DataTableModule } from 'angular2-datatable';
import { IfEmptyPipe } from '../_pipes/index';
import { PipesDirectivesSharedModule } from '../_shared/index';
import { Select2Module } from 'ng2-select2';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { WidgetModule } from '../layout/widget/widget.module';
import { TooltipModule } from 'ng2-bootstrap/tooltip';

// ngx-uploader
import { NgUploaderModule } from 'ngx-uploader';

import {RegistriListComponent} from './list/registri-list.component';
import {RegistriEditComponent} from './edit/registri-edit.component';


export const routes = [
    {path: '', redirectTo: 'list', pathMatch: 'full'},
    {path: 'list', component: RegistriListComponent},
    {path: 'edit', component: RegistriEditComponent},
    {path: 'edit/:id', component: RegistriEditComponent}
];

@NgModule({
    imports: [
        CommonModule,
        WidgetModule,
        FormsModule,
        ReactiveFormsModule,

        ModalModule,
        DataTableModule,
        StickTheadModule,
        NKDatetimeModule,
        Select2Module,
        NgUploaderModule,
        PipesDirectivesSharedModule,
        TooltipModule.forRoot(),
        RouterModule.forChild(routes)
    ],
    declarations: [
        RegistriListComponent,
        RegistriEditComponent,
        IfEmptyPipe
    ]
})
export class RegistriModule {
    static routes = routes;
}
