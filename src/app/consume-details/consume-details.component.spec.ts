import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumeDetailsComponent } from './consume-details.component';

describe('ConsumeDetailsComponent', () => {
  let component: ConsumeDetailsComponent;
  let fixture: ComponentFixture<ConsumeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
