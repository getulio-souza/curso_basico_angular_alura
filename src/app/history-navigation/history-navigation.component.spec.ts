import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryNavigationComponent } from './history-navigation.component';

describe('HistoryNavigationComponent', () => {
  let component: HistoryNavigationComponent;
  let fixture: ComponentFixture<HistoryNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
