import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ITPageComponent } from './itPage.component';

describe('ITPageComponent', () => {
  let component: ITPageComponent;
  let fixture: ComponentFixture<ITPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ITPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ITPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
