import { TestBed } from '@angular/core/testing';

import { RssFeedService } from './rss-feed.service';

describe('RssFeedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RssFeedService = TestBed.get(RssFeedService);
    expect(service).toBeTruthy();
  });
});
