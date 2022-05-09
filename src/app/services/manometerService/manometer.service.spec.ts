import { TestBed, inject } from '@angular/core/testing';

import { ManometerService} from './manometer.service';

describe('ManometerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManometerService]
    });
  });

  it('should be created', inject([ManometerService], (service: ManometerService) => {
    expect(service).toBeTruthy();
  }));
});
