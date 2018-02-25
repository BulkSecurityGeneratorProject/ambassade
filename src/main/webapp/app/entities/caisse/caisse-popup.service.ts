import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Caisse } from './caisse.model';
import { CaisseService } from './caisse.service';

@Injectable()
export class CaissePopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private caisseService: CaisseService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.caisseService.find(id)
                    .subscribe((caisseResponse: HttpResponse<Caisse>) => {
                        const caisse: Caisse = caisseResponse.body;
                        caisse.dateDuJour = this.datePipe
                            .transform(caisse.dateDuJour, 'yyyy-MM-ddTHH:mm:ss');
                        caisse.dateRetour = this.datePipe
                            .transform(caisse.dateRetour, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.caisseModalRef(component, caisse);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.caisseModalRef(component, new Caisse());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    caisseModalRef(component: Component, caisse: Caisse): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.caisse = caisse;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
