# Proposal

## Why

The platform needs a clear, secure entry point and a useful first screen for developers to monitor their own requests. The project already defines Keycloak PKCE authentication and asynchronous request execution, but it has no frontend application or screens yet.

## What Changes

- Add a login screen that starts the Keycloak OpenID Connect authorization-code flow with PKCE and returns authenticated users to the application.
- Add an authenticated application shell with a responsive sidebar containing Home, Criar Projeto, and Criar Workflow.
- Add a personal dashboard that summarizes and lists the signed-in user's requests, showing their current status and executor progress when available.
- Support the documented light appearance and an optional dark appearance, with accessible responsive layouts.
- Keep the Criar Projeto and Criar Workflow destinations as navigation placeholders in this change; their complete forms, project/resource creation flow, and workflow designer are out of scope.
- Assume the dashboard shows only the current user's requests, not an organization-wide overview or a queue of approvals assigned to the user.

## Capabilities

### New Capabilities

- `user-authentication`: Keycloak-based sign-in using OpenID Connect authorization code with PKCE, including the authenticated return to the application.
- `personal-request-dashboard`: An authenticated shell with the defined sidebar and a dashboard for viewing the current user's request statuses and progress.

### Modified Capabilities

None.

## Impact

- Greenfield Angular frontend; repository documentation specifies the latest stable Angular, responsive layouts, light appearance, and optional dark appearance, but no frontend source, package manifest, or Angular workspace is present.
- Keycloak integration depends on an OIDC client configuration and backend/API contracts that are not yet present in the repository.
- Dashboard status and progress depend on request data and asynchronous executor events over SSE, as described in the product specification.
- The frontend should follow the documented accessibility target of WCAG 2.1 AA and avoid storing sensitive tokens in local storage.
