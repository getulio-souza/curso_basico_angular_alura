import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DndTimeChartComponent } from './dnd-time-chart.component';

describe('DndTimeChartComponent', () => {
  let component: DndTimeChartComponent;
  let fixture: ComponentFixture<DndTimeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DndTimeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DndTimeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
