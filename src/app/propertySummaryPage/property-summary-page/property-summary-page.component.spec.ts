import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertySummaryPageComponent } from './property-summary-page.component';

describe('PropertySummaryPageComponent', () => {
  let component: PropertySummaryPageComponent;
  let fixture: ComponentFixture<PropertySummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertySummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertySummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
