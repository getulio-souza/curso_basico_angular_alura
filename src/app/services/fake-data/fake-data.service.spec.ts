import { TestBed, inject } from '@angular/core/testing';

import { FakeDataService } from './fake-data.service';

describe('FakeDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FakeDataService]
    });
  });

  it('should be created', inject([FakeDataService], (service: FakeDataService) => {
    expect(service).toBeTruthy();
  }));
});
