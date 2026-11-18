# Tasks

## 1. Frontend Foundation

- [x] 1.1 Scaffold the greenfield Angular workspace with the latest stable compatible version and standalone routing; verify dependency installation and a production build succeed.
- [x] 1.2 Add the responsive application foundation, light/dark theme tokens, and accessible shared layout primitives; verify keyboard navigation, narrow-screen navigation, and theme contrast in component tests.
- [x] 1.3 Document local setup, configuration, and validation commands; verify a new developer can follow the documented commands to install and build the frontend.

## 2. Keycloak Authentication

- [x] 2.1 Integrate a maintained Angular-compatible OIDC client for Keycloak authorization-code flow with PKCE, callback validation, route protection, and sign-out; verify login, callback error, return-route, and logout tests pass.
- [x] 2.2 Configure non-secret issuer, client ID, and redirect settings and prevent token persistence in local storage; verify configuration validation and a test confirms no sensitive token is written to local storage.

## 3. Authenticated Shell and Navigation

- [x] 3.1 Implement the authenticated shell with Home, Criar Projeto, Criar Workflow, profile, and sign-out affordances; verify protected routing and each navigation destination with route tests.
- [x] 3.2 Add clear unavailable placeholders for Criar Projeto and Criar Workflow; verify each placeholder provides accessible navigation back to Home and does not imply the workflows are implemented.
- [x] 3.3 Add and document responsive sidebar behavior and accessible labels; verify keyboard operation and mobile menu behavior with component tests.

## 4. Personal Request Dashboard

- [ ] 4.1 Agree and document the authenticated request-list and SSE contracts with the backend, including request ownership, identifiers, status/progress fields, completion events, and stream authentication; verify the contract covers all dashboard scenarios before production wiring.
- [x] 4.2 Implement a typed request-data adapter and dashboard loading, summary, request-list, empty, retryable-error, and stale-update states; verify each state with focused component/service tests.
- [ ] 4.3 Connect live executor progress and completion events through the adapter without placing bearer tokens in event URLs; verify matching requests update without reload and retain the latest data after a stream disconnect.

## 5. End-to-End Validation

- [ ] 5.1 Add end-to-end coverage for unauthenticated access, successful Keycloak callback, dashboard navigation, and sign-out using a controlled identity-provider test setup; verify the suite passes without requiring production credentials.
- [ ] 5.2 Validate WCAG 2.1 AA-relevant keyboard, accessible-name, contrast, and responsive behaviors across login and dashboard screens; verify findings are resolved or recorded before release.
- [ ] 5.3 Run the documented lint, test, and production-build checks and record results; verify the frontend can be deployed without embedding secrets or requiring the out-of-scope project/workflow screens.
