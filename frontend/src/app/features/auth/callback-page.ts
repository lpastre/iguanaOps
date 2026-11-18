import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { take } from 'rxjs';

@Component({
  selector: 'app-callback-page',
  template: `
    <main class="callback-state" aria-live="polite">
      <p>Validando autenticação...</p>
    </main>
  `,
  styles: `
    .callback-state {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 1.25rem;
    }
  `,
})
export class CallbackPage {
  constructor() {
    const oidc = inject(OidcSecurityService);
    const router = inject(Router);

    oidc.isAuthenticated$.pipe(take(1)).subscribe((result) => {
      if (result.isAuthenticated) {
        const returnUrl =
          sessionStorage.getItem('iguanaops.return-url') || '/';
        sessionStorage.removeItem('iguanaops.return-url');
        void router.navigateByUrl(returnUrl);
      } else {
        void router.navigate(['/login'], {
          queryParams: { error: 'callback' },
        });
      }
    });
  }
}
