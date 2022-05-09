import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultChartItComponent } from './mult-chart-it.component';

describe('MultChartItComponent', () => {
  let component: MultChartItComponent;
  let fixture: ComponentFixture<MultChartItComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultChartItComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultChartItComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
