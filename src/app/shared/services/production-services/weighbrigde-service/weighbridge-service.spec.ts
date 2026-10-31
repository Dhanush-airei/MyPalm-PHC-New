import { TestBed } from '@angular/core/testing';

import { WeighbridgeService } from './weighbridge-service';

describe('WeighbridgeService', () => {
  let service: WeighbridgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeighbridgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
