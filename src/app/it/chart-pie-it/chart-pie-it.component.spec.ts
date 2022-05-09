import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartPieItComponent } from './chart-pie-it.component';

describe('ChartPieItComponent', () => {
  let component: ChartPieItComponent;
  let fixture: ComponentFixture<ChartPieItComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartPieItComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartPieItComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
