import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { Livre } from './livre.model';
import { LivreService } from './livre.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';

@Component({
    selector: 'jhi-livre',
    templateUrl: './livre.component.html'
})
export class LivreComponent implements OnInit, OnDestroy {

currentAccount: any;
    livres: Livre[];
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
        private livreService: LivreService,
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
        this.livreService.query({
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()}).subscribe(
                (res: HttpResponse<Livre[]>) => this.onSuccess(res.body, res.headers),
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
        this.router.navigate(['/livre'], {queryParams:
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
        this.router.navigate(['/livre', {
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
        this.registerChangeInLivres();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Livre) {
        return item.id;
    }
    registerChangeInLivres() {
        this.eventSubscriber = this.eventManager.subscribe('livreListModification', (response) => this.loadAll());
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
            dataHeader: ['ambassadeApp.livre.codeISBN',
                'ambassadeApp.livre.auteur',
                'ambassadeApp.livre.prenom',
                'ambassadeApp.livre.titre',
                'ambassadeApp.livre.edition',
                'ambassadeApp.livre.annee',
                'ambassadeApp.livre.categorie',
                'ambassadeApp.livre.resume',
                'ambassadeApp.livre.origine',
                'ambassadeApp.livre.lieuEdition'],
            dataContent: this.livres,
            property: ['codeISBN',
                'auteur',
                'prenom',
                'titre',
                'edition',
                'annee',
                'categorie',
                'resume',
                'origine',
                'lieuEdition'],
            // property: Object.getOwnPropertyNames(this.livres[0]),
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
        this.livres = data;
    }
    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
