import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertySummaryPageComponent2 } from './property-summary-page-2.component';

describe('PropertySummaryPageComponent2', () => {
  let component: PropertySummaryPageComponent2;
  let fixture: ComponentFixture<PropertySummaryPageComponent2>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertySummaryPageComponent2 ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertySummaryPageComponent2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
