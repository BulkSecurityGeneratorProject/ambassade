import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { Caisse } from './caisse.model';
import { CaisseService } from './caisse.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import {CaisseSearchModel} from './caisse-search.model';

@Component({
    selector: 'jhi-caisse',
    templateUrl: './caisse.component.html'
})
export class CaisseComponent implements OnInit, OnDestroy {

currentAccount: any;
    caisses: Caisse[];
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
        private caisseService: CaisseService,
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
        this.caisseService.query({
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()}).subscribe(
                (res: HttpResponse<Caisse[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    searchCaisse(caisse: CaisseSearchModel) {
        this.caisseService.search(caisse).subscribe(
            (res: HttpResponse<Caisse[]>) => this.onSuccess(res.body, res.headers),
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
        this.router.navigate(['/caisse'], {queryParams:
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
        this.router.navigate(['/caisse', {
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
        this.registerChangeInCaisses();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Caisse) {
        return item.id;
    }
    registerChangeInCaisses() {
        // this.eventSubscriber = this.eventManager.subscribe('caisseListModification', (response) => this.loadAll());
        this.eventSubscriber = this.eventManager.subscribe('caisseListModification', (response) => {
            if (typeof response.content === 'string') {
                return this.loadAll();
            }else {
                return this.searchCaisse(response.content);
            }
        });
    }

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
            dataHeader: ['ambassadeApp.categorie.reference',
                'ambassadeApp.categorie.dateDuJour',
                'ambassadeApp.categorie.nom',
                'ambassadeApp.categorie.prenom',
                'ambassadeApp.categorie.serviceConcerne',
                'ambassadeApp.categorie.monnaie',
                'ambassadeApp.categorie.montant',
                'ambassadeApp.categorie.dateRetour',
                'ambassadeApp.categorie.telephone',
                'ambassadeApp.categorie.paiement'],
            dataContent: this.caisses,
            property: Object.getOwnPropertyNames(this.caisses[0]),
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
        this.caisses = data;
    }
    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
