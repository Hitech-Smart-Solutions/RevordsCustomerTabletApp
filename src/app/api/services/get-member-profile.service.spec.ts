import { TestBed } from '@angular/core/testing';

import { GetMemberProfileService } from './get-member-profile.service';

describe('GetMemberProfileService', () => {
  let service: GetMemberProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetMemberProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
