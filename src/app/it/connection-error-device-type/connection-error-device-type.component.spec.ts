import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionErrorDeviceTypeComponent } from './connection-error-device-type.component';

describe('ConnectionErrorDeviceTypeComponent', () => {
  let component: ConnectionErrorDeviceTypeComponent;
  let fixture: ComponentFixture<ConnectionErrorDeviceTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionErrorDeviceTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionErrorDeviceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
