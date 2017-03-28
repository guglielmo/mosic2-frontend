import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ng2-bootstrap/tooltip';
import { SimpleNotificationsModule } from 'angular2-notifications/components';

import 'jquery-slimscroll';

import { LayoutRoutingModule } from './layout-routing.module';

import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    LayoutRoutingModule
  ],
  declarations: [
    LayoutComponent,
    SidebarComponent,
    NavbarComponent
  ]
})
export class LayoutModule {
}
