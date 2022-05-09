import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorDetailsGridComponent } from './floor-details-grid.component';

describe('FloorDetailsGridComponent', () => {
  let component: FloorDetailsGridComponent;
  let fixture: ComponentFixture<FloorDetailsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloorDetailsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorDetailsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
