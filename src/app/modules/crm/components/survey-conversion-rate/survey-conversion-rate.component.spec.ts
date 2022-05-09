import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyConversionRateComponent } from './survey-conversion-rate.component';

describe('SurveyConversionRateComponent', () => {
  let component: SurveyConversionRateComponent;
  let fixture: ComponentFixture<SurveyConversionRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyConversionRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyConversionRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
