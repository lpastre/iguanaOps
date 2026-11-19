import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export type ProjectCreationPhase =
  | 'service'
  | 'platform'
  | 'template'
  | 'repository'
  | 'resources';

export interface ServiceDetails {
  readonly serviceName: string;
  readonly namespace: string;
  readonly description: string;
  readonly responsibleTeam: string;
}

export interface PlatformDetails {
  readonly kubernetesTarget: string;
  readonly environment: string;
  readonly targetCluster: string;
  readonly region: string;
}

export interface ProjectTemplateDetails {
  readonly archetype: string;
  readonly templateVersion: string;
  readonly runtimeVariant: string;
  readonly languageVersion: string;
}

export interface RepositoryDetails {
  readonly gitAddress: string;
  readonly repositoryName: string;
  readonly defaultBranch: string;
  readonly pipelineProfile: string;
}

export interface ResourceDetails {
  readonly hasAdditionalResources: boolean;
  readonly resourceType: string;
  readonly resourceName: string;
  readonly resourceConfiguration: string;
}

export type ProjectCreationSubmission =
  | { readonly phase: 'service'; readonly data: ServiceDetails }
  | { readonly phase: 'platform'; readonly data: PlatformDetails }
  | { readonly phase: 'template'; readonly data: ProjectTemplateDetails }
  | { readonly phase: 'repository'; readonly data: RepositoryDetails }
  | { readonly phase: 'resources'; readonly data: ResourceDetails };

export type ProjectCreationExecutionResult =
  | { readonly status: 'success'; readonly message: string }
  | { readonly status: 'failed'; readonly message: string }
  | { readonly status: 'unavailable'; readonly message: string };

@Injectable({ providedIn: 'root' })
export class ProjectCreationExecutionService {
  execute(
    _submission: ProjectCreationSubmission,
  ): Observable<ProjectCreationExecutionResult> {
    return of({
      status: 'unavailable',
      message: 'A execução desta etapa ainda não está integrada a um serviço.',
    });
  }
}
