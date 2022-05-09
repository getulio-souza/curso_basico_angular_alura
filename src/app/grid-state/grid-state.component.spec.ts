import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridStateComponent } from './grid-state.component';

describe('GridStateComponent', () => {
  let component: GridStateComponent;
  let fixture: ComponentFixture<GridStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
