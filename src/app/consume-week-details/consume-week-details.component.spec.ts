import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumeWeekDetailsComponent } from './consume-week-details.component';

describe('ConsumeWeekDetailsComponent', () => {
  let component: ConsumeWeekDetailsComponent;
  let fixture: ComponentFixture<ConsumeWeekDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumeWeekDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumeWeekDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
