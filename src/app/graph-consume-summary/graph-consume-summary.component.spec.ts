import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphConsumeSummaryComponent } from './graph-consume-summary.component';

describe('GraphConsumeSummaryComponent', () => {
  let component: GraphConsumeSummaryComponent;
  let fixture: ComponentFixture<GraphConsumeSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphConsumeSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphConsumeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
