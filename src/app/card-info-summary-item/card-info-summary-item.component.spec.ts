import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardInfoSummaryItemComponent } from './card-info-summary-item.component';

describe('CardInfoSummaryItemComponent', () => {
  let component: CardInfoSummaryItemComponent;
  let fixture: ComponentFixture<CardInfoSummaryItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardInfoSummaryItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardInfoSummaryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
