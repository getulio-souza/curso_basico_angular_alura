import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesChartComponent } from './messages-chart.component';

describe('MessagesChartComponent', () => {
  let component: MessagesChartComponent;
  let fixture: ComponentFixture<MessagesChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagesChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
