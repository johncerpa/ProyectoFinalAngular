import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupOperatorComponent } from './signup-operator.component';

describe('SignupOperatorComponent', () => {
  let component: SignupOperatorComponent;
  let fixture: ComponentFixture<SignupOperatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupOperatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
