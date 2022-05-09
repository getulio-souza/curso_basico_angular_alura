import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgElapsedTimeByPractitionerComponent } from './avg-elapsed-time-by-practitioner.component';

describe('AvgElapsedTimeByPractitionerComponent', () => {
  let component: AvgElapsedTimeByPractitionerComponent;
  let fixture: ComponentFixture<AvgElapsedTimeByPractitionerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvgElapsedTimeByPractitionerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvgElapsedTimeByPractitionerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
