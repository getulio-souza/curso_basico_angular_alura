import { TestBed, inject } from '@angular/core/testing';

import { ProxperAuthService } from './proxper-auth.service';

describe('ProxperAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProxperAuthService]
    });
  });

  it('should be created', inject([ProxperAuthService], (service: ProxperAuthService) => {
    expect(service).toBeTruthy();
  }));
});
