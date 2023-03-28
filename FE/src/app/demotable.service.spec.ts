import { TestBed } from '@angular/core/testing';

import { DemotableService } from './demotable.service';

describe('DemotableService', () => {
  let service: DemotableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemotableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
