import { TestBed, inject } from '@angular/core/testing';

import { TkoChartBuilderService } from './tko-chart-builder.service';

describe('TkoChartBuilderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TkoChartBuilderService]
    });
  });

  it('should be created', inject([TkoChartBuilderService], (service: TkoChartBuilderService) => {
    expect(service).toBeTruthy();
  }));
});
