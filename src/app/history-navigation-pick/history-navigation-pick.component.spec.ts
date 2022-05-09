import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryNavigationPickComponent } from './history-navigation-pick.component';

describe('HistoryNavigationPickComponent', () => {
  let component: HistoryNavigationPickComponent;
  let fixture: ComponentFixture<HistoryNavigationPickComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryNavigationPickComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryNavigationPickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
