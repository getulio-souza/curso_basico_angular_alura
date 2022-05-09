import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalControl } from './modal-control.component';

describe('ModalControl', () => {
  let component: ModalControl;
  let fixture: ComponentFixture<ModalControl>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalControl ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalControl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
