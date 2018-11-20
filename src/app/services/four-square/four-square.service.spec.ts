import { TestBed } from '@angular/core/testing';

import { FourSquareService } from './four-square.service';

describe('FourSquareService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FourSquareService = TestBed.get(FourSquareService);
    expect(service).toBeTruthy();
  });
});
