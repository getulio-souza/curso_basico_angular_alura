import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesGridComponent } from './devices-grid.component';

describe('DevicesGridComponent', () => {
  let component: DevicesGridComponent;
  let fixture: ComponentFixture<DevicesGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicesGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
