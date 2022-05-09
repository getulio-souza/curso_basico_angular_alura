import { TestBed, inject } from '@angular/core/testing';

import { NumericRoundService } from './numeric-round.service';

describe('NumericRoundService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NumericRoundService]
    });
  });

  it('should be created', inject([NumericRoundService], (service: NumericRoundService) => {
    expect(service).toBeTruthy();
  }));
});
