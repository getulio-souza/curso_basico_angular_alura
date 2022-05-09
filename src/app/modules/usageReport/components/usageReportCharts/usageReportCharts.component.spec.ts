import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageReportChartsComponent } from './usageReportCharts.component';

describe('UsageReportChartsComponent', () => {
  let component: UsageReportChartsComponent;
  let fixture: ComponentFixture<UsageReportChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsageReportChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageReportChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
