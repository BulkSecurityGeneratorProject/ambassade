import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { Monnaie } from './monnaie.model';
import { MonnaieService } from './monnaie.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';

@Component({
    selector: 'jhi-monnaie',
    templateUrl: './monnaie.component.html'
})
export class MonnaieComponent implements OnInit, OnDestroy {

currentAccount: any;
    monnaies: Monnaie[];
    error: any;
    success: any;
    eventSubscriber: Subscription;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;

    constructor(
        private monnaieService: MonnaieService,
        private parseLinks: JhiParseLinks,
        private jhiAlertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe((data) => {
            this.page = data.pagingParams.page;
            this.previousPage = data.pagingParams.page;
            this.reverse = data.pagingParams.ascending;
            this.predicate = data.pagingParams.predicate;
        });
    }

    loadAll() {
        this.monnaieService.query({
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()}).subscribe(
                (res: HttpResponse<Monnaie[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    searchMonnaie(monnaie: Monnaie) {
        this.monnaieService.search(monnaie).subscribe(
            (res: HttpResponse<Monnaie[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }
    transition() {
        this.router.navigate(['/monnaie'], {queryParams:
            {
                page: this.page,
                size: this.itemsPerPage,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.router.navigate(['/monnaie', {
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        }]);
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInMonnaies();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Monnaie) {
        return item.id;
    }
    registerChangeInMonnaies() {
        // this.eventSubscriber = this.eventManager.subscribe('monnaieListModification', (response) => this.loadAll());
        this.eventSubscriber = this.eventManager.subscribe('monnaieListModification', (response) => {
            if (typeof response.content === 'string') {
                return this.loadAll();
            }else {
                return this.searchMonnaie(response.content);
            }
        });    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    printPage() {
        const callVerbose: {
            dataHeader: any;
            dataContent: any;
            property: any;
        } = {
            dataHeader: ['ambassadeApp.monnaie.type',
                'ambassadeApp.monnaie.montant',
                'ambassadeApp.monnaie.produit'],
            dataContent: this.monnaies,
            property: Object.getOwnPropertyNames(this.monnaies[0]),
        };
        this.router.navigateByData({
            url: ['/print'],
            // data: this.categories
            data: callVerbose
        });
    }

    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        // this.page = pagingParams.page;
        this.monnaies = data;
    }
    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
