import { TestBed } from '@angular/core/testing';

import { IfLoginGuard } from './if-login.guard';

describe('IfLoginGuard', () => {
  let guard: IfLoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IfLoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
