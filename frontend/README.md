# IguanaOps Frontend

Angular 21 standalone application for the IguanaOps web interface. The project is in `frontend/` and uses npm.

## Requirements

- Node.js 24 or later (Angular CLI 21 supports Node.js 20.19+, 22.12+, or 24+)
- npm 11 or compatible

## Install and run

From the repository root:

```sh
cd frontend
npm ci
npm start
```

Open `http://localhost:4200/`. The development server reloads when application source files change.

## Validation

Run these commands from `frontend/`:

```sh
npm test -- --watch=false
npm run build
```

The production build is written to `frontend/dist/iguanaops-frontend/`.

## Application notes

- The interface defaults to the light theme and provides a dark-theme toggle.
- Authentication uses the public `iguanaops-web` client in the `iguanaops` Keycloak realm. Development defaults are defined in `src/app/core/auth/auth.config.ts`: issuer `http://localhost:8080/realms/iguanaops`, callback `/callback`, and post-logout redirect `/login`.
- Register `http://localhost:4200/callback` and `http://localhost:4200/login` as valid redirect URIs in Keycloak. Set the client as public and enable Authorization Code flow with PKCE.
- Authentication uses in-memory security storage. Sensitive tokens are not written to local storage or session storage; `sessionStorage` is used only for the post-login return route.
- The login page contains a temporary "Entrar sem autenticação" button for local UI development. It only toggles mock authenticated state in the Angular app and must not be treated as a production authentication mechanism.
- Do not add Keycloak client secrets or other credentials to frontend environment files; browser applications are public clients.
