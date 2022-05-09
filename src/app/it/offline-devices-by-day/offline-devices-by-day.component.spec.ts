import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineDevicesByDayComponent } from './offline-devices-by-day.component';

describe('OfflineDevicesByDayComponent', () => {
  let component: OfflineDevicesByDayComponent;
  let fixture: ComponentFixture<OfflineDevicesByDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineDevicesByDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineDevicesByDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
