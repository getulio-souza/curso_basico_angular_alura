import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeuproomHistogramChartComponent } from './makeuproom-histogram-chart.component';

describe('MakeuproomHistogramChartComponent', () => {
  let component: MakeuproomHistogramChartComponent;
  let fixture: ComponentFixture<MakeuproomHistogramChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeuproomHistogramChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeuproomHistogramChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
