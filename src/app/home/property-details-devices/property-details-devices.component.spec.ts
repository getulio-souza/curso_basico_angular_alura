import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDetailsDevicesComponent } from './property-details-devices.component';

describe('PropertyDetailsDevicesComponent', () => {
  let component: PropertyDetailsDevicesComponent;
  let fixture: ComponentFixture<PropertyDetailsDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyDetailsDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDetailsDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
