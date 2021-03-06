import './vendor.ts';

import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Ng2Webstorage, LocalStorageService, SessionStorageService  } from 'ngx-webstorage';
import { JhiEventManager } from 'ng-jhipster';

import { AuthInterceptor } from './blocks/interceptor/auth.interceptor';
import { AuthExpiredInterceptor } from './blocks/interceptor/auth-expired.interceptor';
import { ErrorHandlerInterceptor } from './blocks/interceptor/errorhandler.interceptor';
import { NotificationInterceptor } from './blocks/interceptor/notification.interceptor';
import { AmbassadeSharedModule, UserRouteAccessService } from './shared';
import { AmbassadeAppRoutingModule} from './app-routing.module';
import { AmbassadeHomeModule } from './home/home.module';
import { AmbassadeAdminModule } from './admin/admin.module';
import { AmbassadeAccountModule } from './account/account.module';
import { AmbassadeEntityModule } from './entities/entity.module';
import { PaginationConfig } from './blocks/config/uib-pagination.config';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import {
    JhiMainComponent,
    NavbarComponent,
    FooterComponent,
    ProfileService,
    PageRibbonComponent,
    ActiveMenuDirective,
    ErrorComponent
} from './layouts';
import 'angular2-navigate-with-data';
import {JasperoConfirmationsModule} from '@jaspero/ng-confirmations';
import {FrappeDirective} from './shared/chart/frappe.directive';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';

@NgModule({
    imports: [
        BrowserModule,
        AmbassadeAppRoutingModule,
        Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-'}),
        AmbassadeSharedModule,
        AmbassadeHomeModule,
        AmbassadeAdminModule,
        AmbassadeAccountModule,
        AmbassadeEntityModule,
        JasperoConfirmationsModule.forRoot(),
        NgbCollapseModule.forRoot(),
        // jhipster-needle-angular-add-module JHipster will add new module here
    ],
    declarations: [
        JhiMainComponent,
        NavbarComponent,
        ErrorComponent,
        PageRibbonComponent,
        ActiveMenuDirective,
        FrappeDirective,
        FooterComponent,
        SidebarComponent
    ],
    providers: [
        ProfileService,
        PaginationConfig,
        UserRouteAccessService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
            deps: [
                LocalStorageService,
                SessionStorageService
            ]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthExpiredInterceptor,
            multi: true,
            deps: [
                Injector
            ]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorHandlerInterceptor,
            multi: true,
            deps: [
                JhiEventManager
            ]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NotificationInterceptor,
            multi: true,
            deps: [
                Injector
            ]
        }
    ],
    bootstrap: [ JhiMainComponent ]
})
export class AmbassadeAppModule {}
