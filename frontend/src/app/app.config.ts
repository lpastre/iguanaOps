import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import {
  AbstractSecurityStorage,
  OidcSecurityService,
  provideAuth,
} from 'angular-auth-oidc-client';
import { take } from 'rxjs';

import { routes } from './app.routes';
import { ThemeService } from './shared/theme/theme.service';
import { oidcConfig } from './core/auth/auth.config';
import { InMemorySecurityStorage } from './core/auth/in-memory-security-storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    provideAuth({ config: oidcConfig }),
    {
      provide: AbstractSecurityStorage,
      useClass: InMemorySecurityStorage,
    },
    provideAppInitializer(() => {
      inject(ThemeService);
    }),
    provideAppInitializer(() => {
      const oidc = inject(OidcSecurityService);
      return oidc.checkAuth().pipe(take(1));
    }),
  ],
};
