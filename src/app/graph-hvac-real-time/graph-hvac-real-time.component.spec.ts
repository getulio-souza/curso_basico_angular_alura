import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphHvacRealTimeComponent } from './graph-hvac-real-time.component';

describe('GraphHvacRealTimeComponent', () => {
  let component: GraphHvacRealTimeComponent;
  let fixture: ComponentFixture<GraphHvacRealTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphHvacRealTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphHvacRealTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
