import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AmbassadeSharedModule } from '../../shared';
import {
    VisaService,
    VisaPopupService,
    VisaComponent,
    VisaDetailComponent,
    VisaDialogComponent,
    VisaPopupComponent,
    VisaDeletePopupComponent,
    VisaDeleteDialogComponent,
    visaRoute,
    visaPopupRoute,
    VisaResolvePagingParams,
} from './';
import {VisaSearchComponent} from './visa-search.component';
import {VisaNouveauComponent} from './visa-nouveau.component';

const ENTITY_STATES = [
    ...visaRoute,
    ...visaPopupRoute,
];

@NgModule({
    imports: [
        AmbassadeSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        VisaComponent,
        VisaNouveauComponent,
        VisaDetailComponent,
        VisaDialogComponent,
        VisaDeleteDialogComponent,
        VisaPopupComponent,
        VisaDeletePopupComponent,
        VisaSearchComponent,
    ],
    entryComponents: [
        VisaComponent,
        VisaDialogComponent,
        VisaPopupComponent,
        VisaDeleteDialogComponent,
        VisaDeletePopupComponent,
    ],
    providers: [
        VisaService,
        VisaPopupService,
        VisaResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AmbassadeVisaModule {}
