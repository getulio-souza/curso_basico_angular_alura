import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryNavigationInputedComponent } from './history-navigation-inputed.component';

describe('HistoryNavigationInputedComponent', () => {
  let component: HistoryNavigationInputedComponent;
  let fixture: ComponentFixture<HistoryNavigationInputedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryNavigationInputedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryNavigationInputedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
