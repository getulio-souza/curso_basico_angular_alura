import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesStatusChartComponent } from './devices-status-chart.component';

describe('DevicesStatusChartComponent', () => {
  let component: DevicesStatusChartComponent;
  let fixture: ComponentFixture<DevicesStatusChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicesStatusChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesStatusChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
