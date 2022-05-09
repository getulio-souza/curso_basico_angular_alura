import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThermostatOnlineChartComponent } from './thermostat-online-chart.component';

describe('ThermostatOnlineChartComponent', () => {
  let component: ThermostatOnlineChartComponent;
  let fixture: ComponentFixture<ThermostatOnlineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThermostatOnlineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThermostatOnlineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
