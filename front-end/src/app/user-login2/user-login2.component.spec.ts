import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLogin2Component } from './user-login2.component';

describe('UserLogin2Component', () => {
  let component: UserLogin2Component;
  let fixture: ComponentFixture<UserLogin2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserLogin2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLogin2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
