import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoRegisteredPropertiesComponent } from './no-registered-properties.component';

describe('NoRegisteredPropertiesComponent', () => {
  let component: NoRegisteredPropertiesComponent;
  let fixture: ComponentFixture<NoRegisteredPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoRegisteredPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoRegisteredPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
