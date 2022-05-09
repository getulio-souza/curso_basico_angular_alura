import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgElapsedTimeByCategoryComponent } from './avg-elapsed-time-by-category.component';

describe('AvgElapsedTimeByCategoryComponent', () => {
  let component: AvgElapsedTimeByCategoryComponent;
  let fixture: ComponentFixture<AvgElapsedTimeByCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvgElapsedTimeByCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvgElapsedTimeByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
