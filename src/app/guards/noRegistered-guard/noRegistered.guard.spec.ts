import { TestBed, async, inject } from '@angular/core/testing';

import { NoRegisteredGuard } from './noRegistered.guard';

describe('NoRegisteredGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoRegisteredGuard]
    });
  });

  it('should ...', inject([NoRegisteredGuard], (guard: NoRegisteredGuard) => {
    expect(guard).toBeTruthy();
  }));
});
