# Spec Delta

## Purpose

Give authenticated users a consistent application shell and a personal view of their project and cloud-resource requests as those requests progress.

## ADDED Requirements

### Requirement: Authenticated shell provides the defined navigation
The system SHALL provide an authenticated application shell with navigation entries for Home, Criar Projeto, and Criar Workflow.

#### Scenario: Authenticated user opens Home
- **WHEN** an authenticated user opens the Home route
- **THEN** the application displays the shared shell with Home, Criar Projeto, and Criar Workflow navigation entries

#### Scenario: User opens an out-of-scope destination
- **WHEN** the user selects Criar Projeto or Criar Workflow in this release
- **THEN** the application displays a clear placeholder explaining that the destination is not yet available and provides a way back to Home

### Requirement: Dashboard shows only the current user's requests
The Home dashboard SHALL summarize and list requests belonging to the authenticated user, using the request status and progress information available to the application.

#### Scenario: User has requests
- **WHEN** the dashboard receives the authenticated user's requests
- **THEN** it displays a summary and a request list with each request's current status and available progress information

#### Scenario: User has no requests
- **WHEN** the dashboard receives an empty request list for the authenticated user
- **THEN** it displays an empty state that explains there are no requests to show

#### Scenario: Request data cannot be loaded
- **WHEN** the dashboard cannot load the authenticated user's requests
- **THEN** it displays an error state and an option to retry without presenting the failure as an empty list

### Requirement: Dashboard reflects asynchronous executor updates
The dashboard SHALL use executor status events delivered through SSE to update the matching request's progress and status without requiring a page reload.

#### Scenario: An executor reports progress
- **WHEN** the dashboard receives an SSE progress event for a listed request
- **THEN** the displayed progress and status for that request are updated

#### Scenario: An executor reports completion
- **WHEN** the dashboard receives an SSE completion event for a listed request
- **THEN** the request is displayed as complete and its progress indicator reflects completion

#### Scenario: The SSE connection is unavailable
- **WHEN** the dashboard cannot receive SSE updates
- **THEN** it preserves the latest request data and indicates that live updates are temporarily unavailable

### Requirement: Screens remain usable across viewport sizes and input methods
The login screen, application shell, and dashboard SHALL support responsive layouts and keyboard navigation, and SHALL target WCAG 2.1 AA accessibility.

#### Scenario: User accesses the application on a narrow viewport
- **WHEN** the viewport is too narrow to display the desktop sidebar
- **THEN** the navigation remains available through a responsive control without obscuring the main content

#### Scenario: User navigates without a pointer
- **WHEN** the user interacts with login, navigation, or dashboard controls using a keyboard
- **THEN** each interactive control is reachable, operable, and has an accessible name
