import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThermostatOccupancyChartComponent } from './thermostat-occupancy-chart.component';

describe('ThermostatOccupancyChartComponent', () => {
  let component: ThermostatOccupancyChartComponent;
  let fixture: ComponentFixture<ThermostatOccupancyChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThermostatOccupancyChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThermostatOccupancyChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
