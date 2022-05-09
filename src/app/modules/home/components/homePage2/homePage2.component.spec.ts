import { HomePage2Component } from './homePage2.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

describe('HomePage2Component', () => {
  let component: HomePage2Component;
  let fixture: ComponentFixture<HomePage2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePage2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
