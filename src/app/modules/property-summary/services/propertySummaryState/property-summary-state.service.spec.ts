import { TestBed, inject } from '@angular/core/testing';

import { PropertySummaryState } from './roperty-summary-state.service';

describe('ContextService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PropertySummaryState]
    });
  });

  it('should be created', inject([PropertySummaryState], (service: PropertySummaryState) => {
    expect(service).toBeTruthy();
  }));
});
