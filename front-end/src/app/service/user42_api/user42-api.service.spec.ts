import { TestBed } from '@angular/core/testing';

import { User42ApiService } from './user42-api.service';

describe('User42ApiService', () => {
  let service: User42ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(User42ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
