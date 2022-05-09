import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomationUsagePercentChartComponent } from './automation-usage-percent-chart.component';

describe('AutomationUsagePercentChartComponent', () => {
  let component: AutomationUsagePercentChartComponent;
  let fixture: ComponentFixture<AutomationUsagePercentChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutomationUsagePercentChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomationUsagePercentChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
