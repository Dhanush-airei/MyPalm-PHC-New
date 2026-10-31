import { TestBed } from '@angular/core/testing';

import { CpoPkStockService } from './cpo-pk-stock-service';

describe('CpoPkStockService', () => {
  let service: CpoPkStockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CpoPkStockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
