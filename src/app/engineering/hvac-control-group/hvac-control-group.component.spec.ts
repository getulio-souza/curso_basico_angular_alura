import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HVACControlGroupComponent } from './hvac-control-group.component';

describe('HVACControlGroupComponent', () => {
  let component: HVACControlGroupComponent;
  let fixture: ComponentFixture<HVACControlGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HVACControlGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HVACControlGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
