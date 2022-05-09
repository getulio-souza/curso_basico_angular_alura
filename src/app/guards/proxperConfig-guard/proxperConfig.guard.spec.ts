import { TestBed, async, inject } from '@angular/core/testing';

import { ProxperConfigGuard } from './proxperConfig.guard';

describe('ProxperConfigGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProxperConfigGuard]
    });
  });

  it('should ...', inject([ProxperConfigGuard], (guard: ProxperConfigGuard) => {
    expect(guard).toBeTruthy();
  }));
});
