import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { RequestDataService } from './request-data.service';

describe('RequestDataService', () => {
  let service: RequestDataService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RequestDataService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(RequestDataService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads requests and exposes the empty state', () => {
    service.load();
    http.expectOne('/api/requests').flush([]);
    expect(service.state()).toEqual({ kind: 'empty', requests: [] });
  });

  it('preserves a retryable error state', () => {
    service.load();
    http.expectOne('/api/requests').flush({}, { status: 503, statusText: 'Unavailable' });
    expect(service.state().kind).toBe('error');
  });
});
