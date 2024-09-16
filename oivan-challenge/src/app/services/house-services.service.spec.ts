import { TestBed } from '@angular/core/testing';

import { HouseServicesService } from './house-services.service';

describe('HouseServicesService', () => {
  let service: HouseServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HouseServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
