import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageReportGrid } from './usage-report-grid.component';

describe('UsageReportGrid', () => {
  let component: UsageReportGrid;
  let fixture: ComponentFixture<UsageReportGrid>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsageReportGrid ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageReportGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
