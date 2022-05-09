import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyResponseDetailComponent } from './survey-response-detail.component';

describe('SurveyResponseDetailComponent', () => {
  let component: SurveyResponseDetailComponent;
  let fixture: ComponentFixture<SurveyResponseDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyResponseDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyResponseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
