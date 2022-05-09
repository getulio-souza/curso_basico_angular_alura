import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlueprintViewComponent } from './blueprint-view.component';

describe('BlueprintViewComponent', () => {
  let component: BlueprintViewComponent;
  let fixture: ComponentFixture<BlueprintViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlueprintViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlueprintViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
