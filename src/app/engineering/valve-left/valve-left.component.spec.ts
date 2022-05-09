import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValveLeftComponent } from './valve-left.component';

describe('ValveLeftComponent', () => {
  let component: ValveLeftComponent;
  let fixture: ComponentFixture<ValveLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValveLeftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValveLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
