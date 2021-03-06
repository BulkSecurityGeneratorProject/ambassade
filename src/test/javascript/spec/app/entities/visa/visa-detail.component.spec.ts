/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { AmbassadeTestModule } from '../../../test.module';
import { VisaDetailComponent } from '../../../../../../main/webapp/app/entities/visa/visa-detail.component';
import { VisaService } from '../../../../../../main/webapp/app/entities/visa/visa.service';
import { Visa } from '../../../../../../main/webapp/app/entities/visa/visa.model';

describe('Component Tests', () => {

    describe('Visa Management Detail Component', () => {
        let comp: VisaDetailComponent;
        let fixture: ComponentFixture<VisaDetailComponent>;
        let service: VisaService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [AmbassadeTestModule],
                declarations: [VisaDetailComponent],
                providers: [
                    VisaService
                ]
            })
            .overrideTemplate(VisaDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(VisaDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(VisaService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Visa(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.visa).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
