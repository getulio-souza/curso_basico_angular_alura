import { TestBed, inject } from '@angular/core/testing';

import { TraceUtilsService } from './trace-utils.service';

describe('TraceUtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TraceUtilsService]
    });
  });

  it('should be created', inject([TraceUtilsService], (service: TraceUtilsService) => {
    expect(service).toBeTruthy();
  }));
});
