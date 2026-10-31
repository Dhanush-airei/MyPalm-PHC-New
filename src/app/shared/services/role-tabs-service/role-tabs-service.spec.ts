import { TestBed } from '@angular/core/testing';

import { RoleTabsService } from './role-tabs-service';

describe('RoleTabsService', () => {
  let service: RoleTabsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleTabsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
