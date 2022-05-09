import { TestBed, inject } from '@angular/core/testing';

import { ProxperConfigService } from './proxperConfig.service';

describe('ProxperConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProxperConfigService]
    });
  });

  it('should be created', inject([ProxperConfigService], (service: ProxperConfigService) => {
    expect(service).toBeTruthy();
  }));
});
