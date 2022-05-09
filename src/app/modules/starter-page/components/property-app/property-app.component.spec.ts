import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyAppComponent } from './property-app.component';

describe('PropertyAppComponent', () => {
  let component: PropertyAppComponent;
  let fixture: ComponentFixture<PropertyAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
