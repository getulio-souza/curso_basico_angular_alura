import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoolingDemandChartComponent } from './cooling-demand-chart.component';

describe('CoolingDemandChartComponent', () => {
  let component: CoolingDemandChartComponent;
  let fixture: ComponentFixture<CoolingDemandChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoolingDemandChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoolingDemandChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
