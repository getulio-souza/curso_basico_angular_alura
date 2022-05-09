import { TestBed, inject } from '@angular/core/testing';

import { NPSHelperService } from './nps-helper.service';

describe('NPSHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NPSHelperService]
    });
  });

  it('should be created', inject([NPSHelperService], (service: NPSHelperService) => {
    expect(service).toBeTruthy();
  }));
});
