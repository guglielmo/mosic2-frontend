import { NgModule }                     from '@angular/core';
import { BrowserModule }                from '@angular/platform-browser';
import { FormsModule }                  from '@angular/forms';
import { HttpModule }                   from '@angular/http';
import { LocationStrategy,
         HashLocationStrategy }         from '@angular/common';

import { Ng2BootstrapModule }           from 'ng2-bootstrap/ng2-bootstrap';
import { ChartsModule }                 from 'ng2-charts/ng2-charts';

// Shared Directives & Components
import { NAV_DROPDOWN_DIRECTIVES }      from './_shared/nav-dropdown.directive';
import { SIDEBAR_TOGGLE_DIRECTIVES }    from './_shared/sidebar.directive';
import { AsideToggleDirective }         from './_shared/aside.directive';
import { BreadcrumbsComponent }         from './_shared/breadcrumb.component';
import { SmartResizeDirective }         from './_shared/smart-resize.directive';
import { AlertComponent }               from './_shared/alert.component'

// Routing Module
import { AppComponent }                 from './app.component';
import { AppRoutingModule }             from './app.routing';

//Layouts
import { FullLayoutComponent }          from './layouts/full-layout.component';
import { SimpleLayoutComponent }        from './layouts/simple-layout.component';

// Guard & Services
import { AuthGuard }                    from './_guards/auth.guard';
import { AuthenticationService,
         UserService,
         AlertService }                  from './_services/index';

// Fake backend
import { fakeBackendProvider }          from './_helpers/index';
import { MockBackend, MockConnection }  from '@angular/http/testing';
import { BaseRequestOptions }           from '@angular/http';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        Ng2BootstrapModule,
        ChartsModule
    ],
    declarations: [
        AppComponent,
        FullLayoutComponent,
        SimpleLayoutComponent,
        NAV_DROPDOWN_DIRECTIVES,
        BreadcrumbsComponent,
        SIDEBAR_TOGGLE_DIRECTIVES,
        AsideToggleDirective,
        SmartResizeDirective,
        AlertComponent
    ],
    providers: [
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        },
        AuthGuard,
        AuthenticationService,
        AlertService,
        UserService,

        // Fake Backend
        fakeBackendProvider,
        MockBackend,
        BaseRequestOptions
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
