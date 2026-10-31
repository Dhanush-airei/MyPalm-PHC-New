import { TestBed } from '@angular/core/testing';

import { LanguagePopoverService } from './language-service';

describe('LanguagePopoverService', () => {
  let service: LanguagePopoverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguagePopoverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
