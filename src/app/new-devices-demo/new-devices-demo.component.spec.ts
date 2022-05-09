import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDevicesDemoComponent } from './new-devices-demo.component';

describe('NewDevicesDemoComponent', () => {
  let component: NewDevicesDemoComponent;
  let fixture: ComponentFixture<NewDevicesDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDevicesDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDevicesDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
