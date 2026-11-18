import { Injectable, inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly oidc = inject(OidcSecurityService);
  private readonly mockedAuthenticated = new BehaviorSubject(false);
  readonly isAuthenticated$ = combineLatest([
    this.oidc.isAuthenticated$.pipe(map((result) => result.isAuthenticated)),
    this.mockedAuthenticated,
  ]).pipe(map(([oidcAuthenticated, mockAuthenticated]) =>
    oidcAuthenticated || mockAuthenticated,
  ));

  mockSignIn(): void {
    this.mockedAuthenticated.next(true);
  }

  signIn(returnUrl = '/'): void {
    this.oidc.authorize(undefined, {
      customParams: {
        prompt: 'login',
      },
      redirectUrl: `${window.location.origin}/callback`,
    });
    sessionStorage.setItem('iguanaops.return-url', returnUrl);
  }

  signOut(): void {
    this.mockedAuthenticated.next(false);
    this.oidc.logoff();
  }
}
