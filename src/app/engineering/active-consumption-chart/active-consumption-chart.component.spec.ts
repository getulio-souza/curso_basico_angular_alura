import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveConsumptionChartComponent } from './active-consumption-chart.component';

describe('ActiveConsumptionChartComponent', () => {
  let component: ActiveConsumptionChartComponent;
  let fixture: ComponentFixture<ActiveConsumptionChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveConsumptionChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveConsumptionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
