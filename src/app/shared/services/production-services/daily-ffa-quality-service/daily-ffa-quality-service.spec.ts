import { TestBed } from '@angular/core/testing';

import { DailyFfaQualityService } from './daily-ffa-quality-service';

describe('DailyFfaQualityService', () => {
  let service: DailyFfaQualityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyFfaQualityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
