import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValveRightComponent } from './valve-right.component';

describe('ValveRightComponent', () => {
  let component: ValveRightComponent;
  let fixture: ComponentFixture<ValveRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValveRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValveRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
