import { OpenIdConfiguration } from 'angular-auth-oidc-client';

export const oidcConfig: OpenIdConfiguration = {
  configId: 'iguanaops',
  authority: 'http://localhost:8080/realms/iguanaops',
  redirectUrl: `${window.location.origin}/callback`,
  postLogoutRedirectUri: `${window.location.origin}/login`,
  clientId: 'iguanaops-web',
  responseType: 'code',
  scope: 'openid profile email',
  useRefreshToken: false,
  silentRenew: false,
  postLoginRoute: '/',
  unauthorizedRoute: '/login',
  forbiddenRoute: '/login',
  logLevel: 2,
};
