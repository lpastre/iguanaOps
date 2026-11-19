# Tasks

## 1. Project Creation Wizard

- [x] 1.1 Replace the `/projects` placeholder with the project-creation feature in the existing authenticated route and verify the route opens the first phase from “Criar Projeto”.
- [x] 1.2 Implement the five ordered forms and proposed field groups from `design.md`, using conditional controls for template- or resource-specific values; verify each phase shows its relevant fields and preserves entered values when moving backward and forward.
- [x] 1.3 Add per-phase validation and independent Back/Avançar navigation; verify invalid forms block advancing and valid forms navigate without losing data.
- [x] 1.4 Add the five-circle progress indicator above the active form with accessible phase labels and current-step state; verify it tracks forward/back navigation and remains usable by keyboard and on narrow viewports.

## 2. Phase Execution and Cloud Resources

- [x] 2.1 Add a typed execution boundary for the active phase and an “Executar” action separate from navigation; verify it submits only valid current-phase data, stays on that phase, and reports pending, successful, failed, or unavailable outcomes without fabricating success.
- [x] 2.2 Implement optional resource selection and keep the IaC review area visible when selected; verify it shows a configured template or an explicit unavailable message, never fabricated IaC, and requires no resource fields when resources are not selected.
- [x] 2.3 Add focused tests for execution and resource behaviors, including invalid input, unavailable execution, and operation failures; verify the project-creation feature test suite passes.

## 3. Integration Validation

- [x] 3.1 Verify the complete five-phase flow in the authenticated shell, including phase progress, preserved values, per-phase execution feedback, and responsive keyboard navigation.
- [x] 3.2 Run the frontend unit tests and production build; verify both complete successfully without regressions to existing routes or screens.
