import { TestBed, inject } from '@angular/core/testing';

import { UnitDataService } from './unit-data.service';

describe('UnitDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitDataService]
    });
  });

  it('should be created', inject([UnitDataService], (service: UnitDataService) => {
    expect(service).toBeTruthy();
  }));
});
