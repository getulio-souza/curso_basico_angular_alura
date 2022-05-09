import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThermometerControlComponent } from './thermometer-control.component';

describe('ThermometerControlComponent', () => {
  let component: ThermometerControlComponent;
  let fixture: ComponentFixture<ThermometerControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThermometerControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThermometerControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
