import { TestBed, inject } from '@angular/core/testing';

import { DeviceDataService } from './device-data.service';

describe('DeviceDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceDataService]
    });
  });

  it('should be created', inject([DeviceDataService], (service: DeviceDataService) => {
    expect(service).toBeTruthy();
  }));
});
