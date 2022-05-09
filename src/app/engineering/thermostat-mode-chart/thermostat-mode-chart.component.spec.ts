import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThermostatModeChartComponent } from './thermostat-mode-chart.component';

describe('ThermostatModeChartComponent', () => {
  let component: ThermostatModeChartComponent;
  let fixture: ComponentFixture<ThermostatModeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThermostatModeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThermostatModeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
