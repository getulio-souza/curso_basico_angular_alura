import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertySummaryComponent2 } from './property-summary2.component';

describe('PropertySummaryComponent2', () => {
  let component: PropertySummaryComponent2;
  let fixture: ComponentFixture<PropertySummaryComponent2>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertySummaryComponent2 ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertySummaryComponent2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
