import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HVACControlDeviceComponent } from './hvac-control-device.component';

describe('HVACControlDeviceComponent', () => {
  let component: HVACControlDeviceComponent;
  let fixture: ComponentFixture<HVACControlDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HVACControlDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HVACControlDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
