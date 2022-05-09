import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownEventsChartComponent } from './down-events-chart.component';

describe('DownEventsChartComponent', () => {
  let component: DownEventsChartComponent;
  let fixture: ComponentFixture<DownEventsChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownEventsChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownEventsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
