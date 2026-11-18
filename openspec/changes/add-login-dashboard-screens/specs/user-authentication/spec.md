# Spec Delta

## Purpose

Provide a secure, predictable sign-in experience for the IguanaOps web application using the organization's Keycloak identity provider.

## ADDED Requirements

### Requirement: Users sign in through Keycloak
The system SHALL provide a login screen that starts the OpenID Connect authorization-code flow with PKCE through Keycloak and SHALL NOT request the user's Keycloak password directly.

#### Scenario: Unauthenticated user opens the application
- **WHEN** an unauthenticated user opens a protected application route
- **THEN** the system presents the login screen before exposing protected content

#### Scenario: User starts sign-in
- **WHEN** the user selects the sign-in action
- **THEN** the system redirects the user to the configured Keycloak authorization endpoint using PKCE

### Requirement: Successful authentication returns the user to the application
The system SHALL validate the authentication response before granting access to protected routes and SHALL return the user to the originally requested route when available, or to Home otherwise.

#### Scenario: Keycloak returns a valid authentication response
- **WHEN** the application receives and validates a successful callback
- **THEN** the user is authenticated and is navigated to the originally requested route or Home

#### Scenario: Keycloak returns an error or invalid response
- **WHEN** the callback contains an authentication error or fails validation
- **THEN** the user remains unauthenticated and is shown a recoverable error with an option to retry sign-in

### Requirement: Users can end their application session
The system SHALL provide a sign-out action that ends access to protected application content.

#### Scenario: Authenticated user signs out
- **WHEN** the user selects sign out
- **THEN** the application ends the authenticated session and returns the user to the login screen

### Requirement: Sensitive tokens are not persisted in local storage
The system SHALL NOT persist sensitive authentication tokens in browser local storage.

#### Scenario: Authentication session is established
- **WHEN** the system stores or uses authentication tokens for the session
- **THEN** it does not write those tokens to browser local storage
