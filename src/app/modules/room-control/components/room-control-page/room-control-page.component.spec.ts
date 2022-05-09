import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomControlPage } from './room-control-page.component';

describe('RoomControlPage', () => {
  let component: RoomControlPage;
  let fixture: ComponentFixture<RoomControlPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomControlPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomControlPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
