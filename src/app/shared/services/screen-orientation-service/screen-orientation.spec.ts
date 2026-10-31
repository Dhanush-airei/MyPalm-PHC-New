import { TestBed } from '@angular/core/testing';

import { ScreenOrientation } from './screen-orientation';

describe('ScreenOrientation', () => {
  let service: ScreenOrientation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScreenOrientation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
