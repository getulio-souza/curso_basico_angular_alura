import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultChartEventsComponent } from './mult-chart-events.component';

describe('MultChartEventsComponent', () => {
  let component: MultChartEventsComponent;
  let fixture: ComponentFixture<MultChartEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultChartEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultChartEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
