import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NPSPageComponent } from './nps-page.component';

describe('NPSPageComponent', () => {
  let component: NPSPageComponent;
  let fixture: ComponentFixture<NPSPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NPSPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NPSPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
