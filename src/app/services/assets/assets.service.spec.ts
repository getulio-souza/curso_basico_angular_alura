import { TestBed, inject } from '@angular/core/testing';

import { AssetsService } from './assets.service';

describe('OrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssetsService]
    });
  });

  it('should be created', inject([AssetsService], (service: AssetsService) => {
    expect(service).toBeTruthy();
  }));
});
