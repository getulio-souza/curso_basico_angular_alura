import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirtyDaysSummaryComponent } from './thirty-days-summary.component';

describe('ThirtyDaysSummaryComponent', () => {
  let component: ThirtyDaysSummaryComponent;
  let fixture: ComponentFixture<ThirtyDaysSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThirtyDaysSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirtyDaysSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
