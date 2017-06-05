import { NgModule, ApplicationRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


// Guard & Services
import { NgxWarehouseModule, WarehouseConfig, DRIVER_TYPE } from 'ngx-warehouse';

import { AuthGuard } from './_guards/auth.guard';
import { AuthenticationService, APICommonService } from './_services/index';


// Fake backend
// import { fakeBackendProvider }          from './_helpers/index';
// import { MockBackend, MockConnection }  from '@angular/http/testing';
// import { BaseRequestOptions }           from '@angular/http';

/*
 * Platform and Environment providers/directives/pipes
 */

import { AppRoutingModule } from './app-routing.module';

// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InteralStateType } from './app.service';
import { AppConfig } from './app.config';

// Application wide providers
const APP_PROVIDERS = [
    ...APP_RESOLVER_PROVIDERS,
    AppState,
    AppConfig
];

const WH_CONFIG: WarehouseConfig = {
    driver: DRIVER_TYPE.INDEXEDDB,
    name: 'Mosic',
    version: 2.0,
    storeName: 'key_value_pairs', // Should be alphanumeric, with underscores.
    description: 'Monitoraggio Sistema CIPE'
};

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        NgxWarehouseModule.configureWarehouse(WH_CONFIG),
        AppRoutingModule
    ],
    providers: [
        // ENV_PROVIDERS,
        APP_PROVIDERS,
        AuthGuard,
        DatePipe,
        APICommonService,
        AuthenticationService
        // Fake Backend
        // fakeBackendProvider,
        // MockBackend,
        // BaseRequestOptions
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
    constructor(public appRef: ApplicationRef, public appState: AppState) {
    }
}

