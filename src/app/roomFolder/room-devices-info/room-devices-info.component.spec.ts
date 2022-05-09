import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomDevicesInfoComponent } from './room-devices-info.component';

describe('RoomDevicesInfoComponent', () => {
  let component: RoomDevicesInfoComponent;
  let fixture: ComponentFixture<RoomDevicesInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomDevicesInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomDevicesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
