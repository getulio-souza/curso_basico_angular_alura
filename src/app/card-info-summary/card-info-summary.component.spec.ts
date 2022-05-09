import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardInfoSummaryComponent } from './card-info-summary.component';

describe('CardInfoSummaryComponent', () => {
  let component: CardInfoSummaryComponent;
  let fixture: ComponentFixture<CardInfoSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardInfoSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardInfoSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
