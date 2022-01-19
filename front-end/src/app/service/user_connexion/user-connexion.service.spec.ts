import { TestBed } from '@angular/core/testing';

import { UserConnexionService } from './user-connexion.service';

describe('UserConnexionService', () => {
  let service: UserConnexionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserConnexionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
