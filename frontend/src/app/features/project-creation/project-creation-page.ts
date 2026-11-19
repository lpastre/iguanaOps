import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { defaultIfEmpty, take } from 'rxjs';
import {
  ProjectCreationExecutionResult,
  ProjectCreationExecutionService,
  ProjectCreationSubmission,
} from './project-creation-execution.service';

const KUBERNETES_NAME_PATTERN = '^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$';

const PROJECT_TEMPLATES = [
  'Microservice Spring Boot',
  'Microservice Spring Boot Native',
  'Kafka Producer/Consumer',
  'Redis Cache',
  'Redis Cache with Replica',
] as const;

const EMPTY_EXECUTION_RESULT: ProjectCreationExecutionResult = {
  status: 'failed',
  message: 'A execução terminou sem retornar um resultado.',
};

type ExecutionDisplayState = {
  readonly status: ProjectCreationExecutionResult['status'] | 'pending';
  readonly message: string;
};

@Component({
  selector: 'app-project-creation-page',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-creation-page.html',
  styleUrl: './project-creation-page.scss',
})
export class ProjectCreationPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly executionService = inject(ProjectCreationExecutionService);

  readonly phases = [
    { title: 'Informações do serviço', description: 'Identifique o serviço.' },
    { title: 'Plataforma', description: 'Defina onde o projeto será executado.' },
    { title: 'Template do projeto', description: 'Escolha o template inicial.' },
    { title: 'Repositório e pipeline', description: 'Configure o Git e a automação.' },
    { title: 'Recursos cloud', description: 'Revise os recursos adicionais.' },
  ] as const;
  readonly projectTemplates = PROJECT_TEMPLATES;
  readonly currentPhase = signal(0);
  private readonly executionStates = signal<
    ReadonlyMap<number, ExecutionDisplayState>
  >(new Map());
  readonly activeExecution = computed(() =>
    this.executionStates().get(this.currentPhase()),
  );
  readonly executionIsPending = computed(
    () => this.activeExecution()?.status === 'pending',
  );

  readonly serviceForm = this.formBuilder.nonNullable.group({
    serviceName: ['', [Validators.required, Validators.maxLength(63), Validators.pattern(KUBERNETES_NAME_PATTERN)]],
    namespace: ['', [Validators.required, Validators.maxLength(63), Validators.pattern(KUBERNETES_NAME_PATTERN)]],
    description: [''],
    responsibleTeam: [''],
  });

  readonly platformForm = this.formBuilder.nonNullable.group({
    kubernetesTarget: ['', Validators.required],
    environment: ['', Validators.required],
    targetCluster: [''],
    region: [''],
  });

  readonly templateForm = this.formBuilder.nonNullable.group({
    archetype: ['', Validators.required],
    templateVersion: [''],
    runtimeVariant: [''],
    languageVersion: [''],
  });

  readonly repositoryForm = this.formBuilder.nonNullable.group({
    gitAddress: ['', Validators.required],
    repositoryName: ['', Validators.required],
    defaultBranch: ['main', Validators.required],
    pipelineProfile: [''],
  });

  readonly resourcesForm = this.formBuilder.nonNullable.group({
    hasAdditionalResources: [false],
    resourceType: [''],
    resourceName: [''],
    resourceConfiguration: [''],
  });

  nextPhase(): void {
    if (this.currentPhase() >= this.phases.length - 1) {
      return;
    }

    if (this.activeForm.invalid) {
      this.activeForm.markAllAsTouched();
      return;
    }

    this.currentPhase.update((phase) => phase + 1);
  }

  previousPhase(): void {
    if (this.currentPhase() > 0) {
      this.currentPhase.update((phase) => phase - 1);
    }
  }

  executeCurrentPhase(): void {
    if (this.activeForm.invalid) {
      this.activeForm.markAllAsTouched();
      return;
    }

    const phase = this.currentPhase();
    this.setExecutionState(phase, {
      status: 'pending',
      message: 'Executando esta etapa...',
    });

    this.executionService
      .execute(this.currentSubmission())
      .pipe(
        take(1),
        defaultIfEmpty(EMPTY_EXECUTION_RESULT),
      )
      .subscribe({
        next: (result) => this.setExecutionState(phase, result),
        error: (error: unknown) => {
          this.setExecutionState(phase, {
            status: 'failed',
            message:
              error instanceof Error && error.message
                ? error.message
                : 'Não foi possível concluir a execução desta etapa.',
          });
        },
      });
  }

  onResourceChoiceChange(): void {
    const resourceControls = [
      this.resourcesForm.controls.resourceType,
      this.resourcesForm.controls.resourceName,
    ];

    for (const control of resourceControls) {
      if (this.resourcesForm.controls.hasAdditionalResources.value) {
        control.addValidators(Validators.required);
      } else {
        control.clearValidators();
      }
      control.updateValueAndValidity();
    }
  }

  hasError(control: AbstractControl): boolean {
    return control.invalid && control.touched;
  }

  validationMessage(control: AbstractControl): string {
    if (control.hasError('required')) {
      return 'Este campo é obrigatório.';
    }
    if (control.hasError('pattern')) {
      return 'Use letras minúsculas, números e hífen, sem hífen no início ou no fim.';
    }
    if (control.hasError('maxlength')) {
      return 'Use no máximo 63 caracteres.';
    }
    return 'Revise o valor informado.';
  }

  private currentSubmission(): ProjectCreationSubmission {
    switch (this.currentPhase()) {
      case 0:
        return { phase: 'service', data: this.serviceForm.getRawValue() };
      case 1:
        return { phase: 'platform', data: this.platformForm.getRawValue() };
      case 2:
        return { phase: 'template', data: this.templateForm.getRawValue() };
      case 3:
        return { phase: 'repository', data: this.repositoryForm.getRawValue() };
      default:
        return { phase: 'resources', data: this.resourcesForm.getRawValue() };
    }
  }

  private setExecutionState(
    phase: number,
    state: ExecutionDisplayState,
  ): void {
    this.executionStates.update((current) => {
      const next = new Map(current);
      next.set(phase, state);
      return next;
    });
  }

  private get activeForm() {
    switch (this.currentPhase()) {
      case 0:
        return this.serviceForm;
      case 1:
        return this.platformForm;
      case 2:
        return this.templateForm;
      case 3:
        return this.repositoryForm;
      default:
        return this.resourcesForm;
    }
  }
}
