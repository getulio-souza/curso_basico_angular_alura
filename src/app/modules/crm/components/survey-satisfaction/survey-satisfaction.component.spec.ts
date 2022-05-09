import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveySatisfactionComponent } from './survey-satisfaction.component';

describe('SurveySatisfactionComponent', () => {
  let component: SurveySatisfactionComponent;
  let fixture: ComponentFixture<SurveySatisfactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveySatisfactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveySatisfactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
