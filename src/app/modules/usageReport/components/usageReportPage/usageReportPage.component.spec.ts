import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageReportPageComponent } from './usageReportPage.component';

describe('UsageReportPageComponent', () => {
  let component: UsageReportPageComponent;
  let fixture: ComponentFixture<UsageReportPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsageReportPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageReportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
