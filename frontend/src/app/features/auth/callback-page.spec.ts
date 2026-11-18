import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';
import { CallbackPage } from './callback-page';

describe('CallbackPage', () => {
  it('returns an authenticated user to the stored route', () => {
    const navigateByUrl = vi.fn();
    sessionStorage.setItem('iguanaops.return-url', '/projects');

    TestBed.configureTestingModule({
      imports: [CallbackPage],
      providers: [
        {
          provide: OidcSecurityService,
          useValue: {
            isAuthenticated$: of({ isAuthenticated: true }),
          },
        },
        {
          provide: Router,
          useValue: { navigateByUrl, navigate: vi.fn() },
        },
      ],
    });

    TestBed.createComponent(CallbackPage);

    expect(navigateByUrl).toHaveBeenCalledWith('/projects');
    expect(sessionStorage.getItem('iguanaops.return-url')).toBeNull();
  });

  it('returns invalid callbacks to login with a recoverable error', () => {
    const navigate = vi.fn();

    TestBed.configureTestingModule({
      imports: [CallbackPage],
      providers: [
        {
          provide: OidcSecurityService,
          useValue: {
            isAuthenticated$: of({ isAuthenticated: false }),
          },
        },
        {
          provide: Router,
          useValue: { navigateByUrl: vi.fn(), navigate },
        },
      ],
    });

    TestBed.createComponent(CallbackPage);

    expect(navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { error: 'callback' },
    });
  });
});
