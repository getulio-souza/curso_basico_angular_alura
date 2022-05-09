import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomationUsageVolumeChartComponent } from './automation-usage-volume-chart.component';

describe('AutomationUsageVolumeChartComponent', () => {
  let component: AutomationUsageVolumeChartComponent;
  let fixture: ComponentFixture<AutomationUsageVolumeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutomationUsageVolumeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomationUsageVolumeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
