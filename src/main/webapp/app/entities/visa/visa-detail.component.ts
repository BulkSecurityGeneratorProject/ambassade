import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Visa } from './visa.model';
import { VisaService } from './visa.service';

@Component({
    selector: 'jhi-visa-detail',
    templateUrl: './visa-detail.component.html'
})
export class VisaDetailComponent implements OnInit, OnDestroy {

    visa: Visa;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private visaService: VisaService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInVisas();
    }

    load(id) {
        this.visaService.find(id)
            .subscribe((visaResponse: HttpResponse<Visa>) => {
                this.visa = visaResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInVisas() {
        this.eventSubscriber = this.eventManager.subscribe(
            'visaListModification',
            (response) => this.load(this.visa.id)
        );
    }
}
