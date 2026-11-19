# Spec Delta

## Purpose

Enable developers to enter project setup information in a guided, five-phase flow and understand which phase is active while configuring project and optional cloud resources.

## ADDED Requirements

### Requirement: Project creation is organized into five forms
The system SHALL provide five ordered project-creation phases, each with a form containing approximately four fields and covering service details, platform, project template, repository and pipeline, or optional cloud resources.

#### Scenario: User opens project creation
- **WHEN** an authenticated user selects “Criar Projeto”
- **THEN** the system displays the first form in the five-phase project-creation flow instead of an unavailable placeholder

#### Scenario: User views each phase
- **WHEN** the user navigates through the project-creation flow
- **THEN** each phase displays its own form and the fields for that phase correspond to its project-setup category

### Requirement: The progress indicator reflects the active phase
The system SHALL display a five-phase progress indicator above the active form, with one circle corresponding to each phase and the current phase visually and programmatically identified.

#### Scenario: User advances or returns between phases
- **WHEN** the user changes the active phase using the forward or back navigation
- **THEN** the progress indicator updates the active circle to match the displayed form

#### Scenario: Progress indicator is read by assistive technology
- **WHEN** assistive technology reads the progress indicator
- **THEN** it can identify the five phases and which phase is current

### Requirement: Users can navigate forward and backward without losing input
The system SHALL provide forward and back controls between the five forms and SHALL preserve entered values when the user changes phases.

#### Scenario: User advances from a valid form
- **WHEN** the user selects the forward control on a valid form before the final phase
- **THEN** the next phase is displayed and the current form's values are retained

#### Scenario: User tries to advance with invalid required input
- **WHEN** the user selects the forward control while the current form has invalid required input
- **THEN** the system identifies the invalid fields and remains on the current phase

#### Scenario: User returns to a previous phase
- **WHEN** the user selects the back control after entering form data
- **THEN** the previous phase is displayed with its previously entered values

### Requirement: Each phase can be executed independently
The system SHALL provide an “Executar” action on each phase that submits only that phase's valid form data and reports the execution outcome without implicitly changing the active phase.

#### Scenario: User executes a valid phase
- **WHEN** the user selects “Executar” on a valid phase
- **THEN** the system submits that phase's data to its configured execution operation and displays the operation's pending, successful, or failed outcome

#### Scenario: User executes a phase with invalid input
- **WHEN** the user selects “Executar” while that phase's form has invalid required input
- **THEN** the system identifies the invalid fields and does not submit the phase

#### Scenario: Phase execution is not configured
- **WHEN** the user selects “Executar” for a phase without an available execution operation
- **THEN** the system reports that the operation is unavailable and does not display a successful execution result

### Requirement: Optional cloud resources can be configured in the resource phase
The system SHALL allow users to indicate whether the project needs additional cloud resources and, when selected, choose a documented resource type and view the IaC review area without presenting an unconfigured template as generated output.

#### Scenario: User does not request additional resources
- **WHEN** the user indicates that no additional cloud resource is needed
- **THEN** the resource phase does not require resource-specific input

#### Scenario: User requests a documented resource
- **WHEN** the user selects an additional resource such as a database or secret manager
- **THEN** the system displays the IaC review area with the associated template when one is configured, or an explicit unavailable message when no template source is configured

### Requirement: The project-creation flow is accessible and responsive
The system SHALL keep the five-phase flow usable on narrow viewports and by keyboard, and SHALL expose form controls, validation feedback, navigation, execution outcomes, and the active phase to assistive technology.

#### Scenario: User operates the flow with a keyboard
- **WHEN** the user navigates the flow without a pointer
- **THEN** the user can reach and operate form, navigation, and execution controls and identify validation or execution feedback

#### Scenario: User opens the flow on a narrow viewport
- **WHEN** the viewport is too narrow for the desktop layout
- **THEN** the active form and its controls remain usable without horizontal page overflow
