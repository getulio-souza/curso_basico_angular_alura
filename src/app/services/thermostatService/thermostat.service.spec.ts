import { TestBed, inject } from '@angular/core/testing';

import { ThermostatService} from './thermostat.service';

describe('ThermostatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThermostatService]
    });
  });

  it('should be created', inject([ThermostatService], (service: ThermostatService) => {
    expect(service).toBeTruthy();
  }));
});
