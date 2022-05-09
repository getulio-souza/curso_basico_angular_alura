import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallUsageVolumeChartComponent } from './call-usage-volume-chart.component';

describe('CallUsageVolumeChartComponent', () => {
  let component: CallUsageVolumeChartComponent;
  let fixture: ComponentFixture<CallUsageVolumeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallUsageVolumeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallUsageVolumeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
