# Design

## Context

See `proposal.md` for motivation and scope. The repository has product and frontend guidance but no Angular workspace, shared design system, Keycloak client configuration, request API, or SSE contract. The two capability specs define the observable behavior.

## Goals / Non-Goals

**Goals:**

- Establish a small, extensible Angular application shell with public and authenticated routes.
- Keep authentication, request loading, and live status updates behind focused services so missing backend contracts do not leak into presentation components.
- Make the initial experience responsive, accessible, and consistent with the documented light/dark appearance.

**Non-Goals:**

- Implement project creation, cloud resource forms, IaC editing, or the workflow designer.
- Add backend services, define executor APIs, or configure a Keycloak realm.
- Build a reusable organization-wide design-system package as part of this screen change.

## Decisions

### Application structure and routing

- Start a greenfield Angular application using standalone components and lazy-loaded routes, following the repository's frontend guidance. Keep the public login/callback routes separate from the authenticated shell; protect Home and placeholder routes with a functional authentication guard.
- Use Angular Signals for local session and dashboard view state. This scope does not justify introducing NgRx or another cross-domain state framework.
- Alternatives considered: placing all screens in a single component would reduce initial setup but makes authentication boundaries, routing, and responsive shell behavior harder to maintain.

### Keycloak integration

- Use a maintained Angular-compatible OpenID Connect client for authorization code with PKCE instead of implementing protocol details manually. Resolve the package version against the Angular version selected when the workspace is scaffolded.
- Keep issuer, client ID, and redirect URLs in non-secret environment configuration. Never include a client secret in the browser application.
- Do not persist sensitive tokens in local storage. Use the client library's in-memory session handling initially; evaluate a backend-for-frontend with secure, HttpOnly cookies when the backend authentication contract is defined.
- Alternatives considered: a password form would duplicate identity-provider behavior and violate the PKCE requirement; local-storage token persistence would increase exposure to script compromise.

### Dashboard data and SSE

- Separate initial request retrieval from live updates behind a typed request-data service. Map backend responses to a small frontend request-summary model instead of binding components to transport payloads.
- Keep loading, empty, retryable error, and stale-live-update states explicit. An SSE disconnect must not erase the latest successfully loaded request data.
- The project has no endpoint, event schema, or SSE authentication contract. Before connecting to a real service, confirm these contracts. The frontend adapter must not put bearer tokens in event URLs; choose a credentialed same-origin stream or an authenticated fetch-based SSE stream according to the agreed backend session model.
- Alternatives considered: connecting UI components directly to `EventSource` couples the view to the missing API and cannot attach arbitrary authorization headers; the adapter keeps the UI stable while the transport contract is finalized.

### Screen and visual structure

- The login page contains the IguanaOps identity, a concise sign-in explanation, and one action that starts Keycloak sign-in; it does not contain local username/password fields.
- The authenticated shell contains the Home dashboard and the two documented menu destinations. In this change, the latter render an explicit unavailable placeholder rather than dead links or partially implemented forms.
- Use light appearance by default and theme tokens for the optional dark appearance. Keep the sidebar persistent on wider screens and expose it through an accessible menu control on narrow screens.
- Alternatives considered: designing the full project and workflow screens in the same change would mix distinct, still-undefined workflows into the authentication/dashboard scope.

### Verification

- Add focused tests for authentication route protection and callback outcomes, dashboard loading/empty/error states, SSE progress/completion updates, and placeholder navigation.
- Validate keyboard operation, accessible names, contrast, and narrow-screen navigation. Use the project's Angular test conventions once a workspace is established; do not assume a test runner is already installed.

## Risks / Trade-offs

- [Keycloak client and redirect settings are not in the repository] -> Make provider configuration explicit and non-secret, and verify redirect URI and logout behavior with the platform owner before deployment.
- [Request API and SSE event contracts are undefined] -> Keep the transport behind an adapter and make contract confirmation an implementation prerequisite; do not fabricate endpoint or event details.
- [In-memory tokens are lost on page reload] -> Prefer the backend-for-frontend/session-cookie option if the platform needs persistent browser sessions; do not trade this off by silently persisting tokens in local storage.
- [No shared design system exists] -> Use a small set of local accessible components and theme tokens without creating a premature shared package.

## Migration Plan

This is a new frontend with no existing screens to migrate. Deploy the application as a new frontend entry point after Keycloak redirect configuration and API/SSE contracts are available. Rollback consists of routing users back to the existing platform entry point; no data migration is required.
