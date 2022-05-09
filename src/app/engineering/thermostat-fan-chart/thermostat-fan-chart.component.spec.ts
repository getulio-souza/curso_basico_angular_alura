import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThermostatFanChartComponent } from './thermostat-fan-chart.component';

describe('ThermostatFanChartComponent', () => {
  let component: ThermostatFanChartComponent;
  let fixture: ComponentFixture<ThermostatFanChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThermostatFanChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThermostatFanChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
