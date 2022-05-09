import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertySummaryCurtainComponent } from './property-summary-curtain.component';

describe('PropertySummaryCurtainComponent', () => {
  let component: PropertySummaryCurtainComponent;
  let fixture: ComponentFixture<PropertySummaryCurtainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertySummaryCurtainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertySummaryCurtainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
