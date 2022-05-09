import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertCarousel } from './alert-carousel.component';

describe('AlertCarousel', () => {
  let component: AlertCarousel;
  let fixture: ComponentFixture<AlertCarousel>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertCarousel ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
