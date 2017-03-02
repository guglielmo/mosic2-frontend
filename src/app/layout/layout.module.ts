import 'jquery-slimscroll';

import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { TooltipModule } from 'ng2-bootstrap/ng2-bootstrap';
import { SimpleNotificationsModule } from 'angular2-notifications/components'


import { Autosize } from 'angular2-autosize';

import { ROUTES }       from './layout.routes';


import { Layout } from './layout.component';
import { Sidebar } from './sidebar/sidebar.component';
import { Navbar } from './navbar/navbar.component';
//import { ChatSidebar } from './chat-sidebar/chat-sidebar.component';
//import { ChatMessage } from './chat-sidebar/chat-message/chat-message.component';
//import {SearchPipe} from './pipes/search.pipe';
//import {NotificationLoad} from './notifications/notifications-load.directive';
//import {Notifications} from './notifications/notifications.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule,
    SimpleNotificationsModule.forRoot(),
    ROUTES
  ],
  declarations: [
    Layout,
    Sidebar,
    Navbar,
    Autosize
    //ChatSidebar,
    //SearchPipe,
    //Notifications,
    //NotificationLoad,
    //ChatMessage
  ]
})
export default class LayoutModule {
}
