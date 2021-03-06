/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { AmbassadeTestModule } from '../../../test.module';
import { PaiementDetailComponent } from '../../../../../../main/webapp/app/entities/paiement/paiement-detail.component';
import { PaiementService } from '../../../../../../main/webapp/app/entities/paiement/paiement.service';
import { Paiement } from '../../../../../../main/webapp/app/entities/paiement/paiement.model';

describe('Component Tests', () => {

    describe('Paiement Management Detail Component', () => {
        let comp: PaiementDetailComponent;
        let fixture: ComponentFixture<PaiementDetailComponent>;
        let service: PaiementService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [AmbassadeTestModule],
                declarations: [PaiementDetailComponent],
                providers: [
                    PaiementService
                ]
            })
            .overrideTemplate(PaiementDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PaiementDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PaiementService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Paiement(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.paiement).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
