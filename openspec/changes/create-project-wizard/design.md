# Design

## Context

See `proposal.md` for motivation and scope. The authenticated Angular shell already routes `/projects` to an unavailable placeholder, and the shell, theme tokens, and unit-test setup are in place. Product documentation lists project metadata, Kubernetes target, Git address, archetype selection, and optional cloud resources with IaC review. No project-creation API or execution contract is present.

## Goals / Non-Goals

**Goals:**

- Replace the existing placeholder without changing the authenticated shell or route.
- Keep form state and navigation predictable across five phases.
- Make each phase's execution action distinct from moving forward or backward.
- Keep backend integration replaceable and represent unavailable, pending, success, and failure outcomes explicitly.

**Non-Goals:**

- Define or implement project-generation, repository, Jenkins, cloud-provisioning, approval, or executor APIs.
- Simulate project creation or report success without a confirmed operation result.
- Change authentication, the dashboard, or workflow creation.

## Decisions

### Keep the existing route and shell

Replace the component rendered by `/projects` with a focused standalone project-creation feature. Retain the shell's navigation, route protection, theme, and responsive layout rather than adding a second navigation surface.

Alternative considered: a separate route per phase. A single route with an in-page phase state better supports preserving the shared form and keeps the requested tabbed experience together.

### Use a single stateful five-phase form

Represent the five ordered phases in one feature component and retain their form values for the lifetime of the flow. Use Angular reactive forms for per-phase validation, keeping the data grouped by the documented categories: service, platform, template, repository/pipeline, and optional resources/IaC. Use the documented inputs and the proposed additional fields below as the initial form inventory; confirm or adjust the proposed defaults during product review.

Alternative considered: independent page navigation for each phase. It adds route/state complexity without a need to deep-link into intermediate forms.

The proposed additional fields to bring the forms to approximately four controls per phase are:

1. **Service:** service description and responsible team, in addition to the documented name and namespace.
2. **Platform:** deployment environment, target cluster, and region, in addition to the documented Kubernetes target.
3. **Project template:** template version, runtime/build variant, and language/runtime version, alongside the documented archetype; show only options relevant to the selected archetype.
4. **Repository and pipeline:** repository name, default branch, and pipeline profile, alongside the documented Git address.
5. **Cloud resources:** resource name, cloud provider, and resource configuration alongside the documented optional resource selection; show IaC for review when applicable.

These are proposed defaults for product review, not existing platform or backend contracts. Resource- and template-specific controls may be conditional so users are not asked to provide irrelevant values.

### Keep execution separate from navigation

“Executar” submits only the current phase's valid values to a typed execution boundary. “Avançar” validates and navigates; it does not execute. Execution does not change the active phase. Show pending and terminal outcomes returned by the operation, and show an explicit unavailable or failure state if execution cannot be started.

The backend contract is not defined. Keep transport details out of the component and do not provide a success-shaped mock. Confirm per-phase operations and their response/error states before connecting real execution.

Alternative considered: executing automatically when advancing or only on the last phase. Both conflict with the requested independent execute action on every phase.

### Show IaC review state without inventing templates

When the user selects a cloud resource, keep the IaC review area visible. Populate it only with a template returned from a configured source; until that source exists, show that template generation is unavailable. Do not generate or label a local placeholder as executable IaC.

Alternative considered: ship sample templates without an agreed provider, format, or backend contract. That would imply the templates are safe and ready to apply when their assumptions are unknown.

### Treat the circles as a phase indicator

Render five labeled circles above the current form, with the current phase identified visually and with an accessible current-step state. The explicit Back and Avançar controls change phases; the indicator reflects that state.

Alternative considered: making every circle a direct navigation control. The request asks for forward and backward navigation and a progress indicator, but does not require skipping phases; requiring validation on forward navigation avoids bypassing incomplete forms.

## Risks / Trade-offs

- [Project execution contracts are absent] → Keep execution behind a typed service boundary, show unavailable/error outcomes explicitly, and confirm contracts before wiring real operations.
- [IaC provider, format, and generation contract are not defined] → Keep the review area visible but indicate that template generation is unavailable until a source is configured.
- [Some of the approximately four fields per phase are not specified in product documentation] → Use the documented inputs as the source of truth and confirm any additional fields before implementation.
- [Per-phase execution may depend on earlier phase data] → Retain all entered values in the flow state and send only the active phase's values plus required prior context through the service boundary.
- [A five-step indicator can become crowded on narrow screens] → Allow the indicator to adapt to the viewport while keeping phase labels/current position perceivable and the active form usable.

## Migration Plan

No data migration is needed. Replace the `/projects` placeholder after the feature and focused tests are ready. Rollback is to restore the placeholder route component; no backend or persisted state is changed by the frontend.

