import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridDevicesComponent } from './grid-devices.component';

describe('GridDevicesComponent', () => {
  let component: GridDevicesComponent;
  let fixture: ComponentFixture<GridDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
