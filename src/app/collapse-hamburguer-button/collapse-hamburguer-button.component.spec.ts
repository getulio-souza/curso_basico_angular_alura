import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapseHamburguerButtonComponent } from './collapse-hamburguer-button.component';

describe('CollapseHamburguerButtonComponent', () => {
  let component: CollapseHamburguerButtonComponent;
  let fixture: ComponentFixture<CollapseHamburguerButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollapseHamburguerButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollapseHamburguerButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
