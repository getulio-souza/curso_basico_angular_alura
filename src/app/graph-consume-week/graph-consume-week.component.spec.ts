import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphConsumeWeekComponent } from './graph-consume-week.component';

describe('GraphConsumeWeekComponent', () => {
  let component: GraphConsumeWeekComponent;
  let fixture: ComponentFixture<GraphConsumeWeekComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphConsumeWeekComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphConsumeWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
