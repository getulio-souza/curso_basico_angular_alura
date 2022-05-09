import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffHistogramChartComponent } from './staff-histogram-chart.component';

describe('StaffHistogramChartComponent', () => {
  let component: StaffHistogramChartComponent;
  let fixture: ComponentFixture<StaffHistogramChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffHistogramChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffHistogramChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
