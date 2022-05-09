import { TestBed, inject } from '@angular/core/testing';

import { ProxperTokenProvider } from './proxper-token-provider.service';

describe('ProxperTokenProvider', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProxperTokenProvider]
    });
  });

  it('should be created', inject([ProxperTokenProvider], (service: ProxperTokenProvider) => {
    expect(service).toBeTruthy();
  }));
});
