import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceTypeOfflineChartComponent } from './device-type-offline-chart.component';

describe('DeviceTypeOfflineChartComponent', () => {
  let component: DeviceTypeOfflineChartComponent;
  let fixture: ComponentFixture<DeviceTypeOfflineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceTypeOfflineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceTypeOfflineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
