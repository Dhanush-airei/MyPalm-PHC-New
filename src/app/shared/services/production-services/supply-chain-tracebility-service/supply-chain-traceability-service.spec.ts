import { TestBed } from '@angular/core/testing';

import { SupplyChainTraceabilityService } from './supply-chain-traceability-service';

describe('SupplyChainTraceabilityService', () => {
  let service: SupplyChainTraceabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplyChainTraceabilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
