import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DndStateChartComponent } from './dnd-state-chart.component';

describe('DndStateChartComponent', () => {
  let component: DndStateChartComponent;
  let fixture: ComponentFixture<DndStateChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DndStateChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DndStateChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
