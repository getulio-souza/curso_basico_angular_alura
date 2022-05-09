import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureRealTimeComponent } from './temperature-real-time.component';

describe('TemperatureRealTimeComponent', () => {
  let component: TemperatureRealTimeComponent;
  let fixture: ComponentFixture<TemperatureRealTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemperatureRealTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperatureRealTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
