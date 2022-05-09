import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerRealTimeComponent } from './power-real-time.component';

describe('PowerRealTimeComponent', () => {
  let component: PowerRealTimeComponent;
  let fixture: ComponentFixture<PowerRealTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowerRealTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerRealTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
