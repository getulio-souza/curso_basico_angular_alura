import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyAverageComponent } from './survey-average.component';

describe('SurveyAverageComponent', () => {
  let component: SurveyAverageComponent;
  let fixture: ComponentFixture<SurveyAverageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyAverageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyAverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
