import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThermostatStateChartComponent } from './thermostat-state-chart.component';

describe('ThermostatStateChartComponent', () => {
  let component: ThermostatStateChartComponent;
  let fixture: ComponentFixture<ThermostatStateChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThermostatStateChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThermostatStateChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
