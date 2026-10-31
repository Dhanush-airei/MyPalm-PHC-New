import { TestBed } from '@angular/core/testing';

import { SterilizerService } from './sterilizer-service';

describe('SterilizerService', () => {
  let service: SterilizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SterilizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
