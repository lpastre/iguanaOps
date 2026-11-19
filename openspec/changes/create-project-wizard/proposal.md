# Proposal

## Why

The existing “Criar Projeto” destination is only a placeholder, while the product specification calls for developers to provide project and optional cloud-resource details. A five-step form makes those inputs easier to complete and gives users clear feedback about their place in the process.

## What Changes

- Replace the “Criar Projeto” placeholder with a five-tab project-creation flow, with each form containing approximately four fields organized around the documented inputs: service details, platform, project template, repository and pipeline, and optional cloud resources.
- Show a five-phase progress indicator above the active form, using one circle per phase and highlighting the phase corresponding to the open tab.
- Provide per-step “Executar” actions and forward/back navigation. Preserve entered values when moving between steps; advancing validates the current step.
- Keep project generation and cloud-resource execution behind an explicit service/API integration. The repository currently has no project-creation backend contract, so this change must not fabricate a successful execution result.
- Keep the flow responsive and accessible within the existing authenticated application shell.

## Capabilities

### New Capabilities

- `project-creation`: A guided five-step project-creation form with phase progress, per-step actions, and navigation.

### Modified Capabilities

None.

## Impact

- Replaces the `/projects` placeholder route and view in the Angular frontend.
- Adds the project-creation forms and progress/navigation behavior using the existing standalone Angular application and shell.
- Real project generation, repository creation, Jenkins configuration, cloud provisioning, and asynchronous status updates require backend/API contracts that are not currently present; their integration must remain explicit rather than simulated.
- Uses the product specification's documented inputs: service name, namespace, Kubernetes target (OpenShift or EKS), Git address, project archetype, and optional cloud resources (database or secret manager) with IaC review.
