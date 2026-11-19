import { TestBed } from '@angular/core/testing';
import { Subject, throwError } from 'rxjs';
import { routes } from '../../app.routes';
import {
  ProjectCreationExecutionResult,
  ProjectCreationExecutionService,
  ProjectCreationSubmission,
} from './project-creation-execution.service';
import { ProjectCreationPage } from './project-creation-page';

describe('ProjectCreationPage', () => {
  const createPage = () => {
    TestBed.configureTestingModule({ imports: [ProjectCreationPage] });
    const fixture = TestBed.createComponent(ProjectCreationPage);
    fixture.detectChanges();
    return fixture;
  };

  it('is the authenticated projects destination and opens on the first phase', () => {
    const authenticatedRoutes = routes.find((route) => route.path === '');
    const projectsRoute = authenticatedRoutes?.children?.find(
      (route) => route.path === 'projects',
    );

    expect(projectsRoute?.component).toBe(ProjectCreationPage);

    const fixture = createPage();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Criar projeto');
    expect(compiled.querySelector('#step-title')?.textContent).toContain(
      'Informações do serviço',
    );
  });

  it('shows the form fields associated with each phase', () => {
    const fixture = createPage();
    const page = fixture.componentInstance;
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('#service-name')).toBeTruthy();
    page.serviceForm.controls.serviceName.setValue('payments-api');
    page.serviceForm.controls.namespace.setValue('payments');
    page.nextPhase();
    fixture.detectChanges();
    expect(compiled.querySelector('#kubernetes-target')).toBeTruthy();

    page.platformForm.controls.kubernetesTarget.setValue('eks');
    page.platformForm.controls.environment.setValue('development');
    page.nextPhase();
    fixture.detectChanges();
    expect(compiled.querySelector('#project-template')).toBeTruthy();

    page.templateForm.controls.archetype.setValue('Microservice Spring Boot');
    fixture.detectChanges();
    expect(compiled.querySelector('#runtime-variant')).toBeTruthy();

    page.nextPhase();
    fixture.detectChanges();
    expect(compiled.querySelector('#git-address')).toBeTruthy();

    page.repositoryForm.controls.gitAddress.setValue('https://git.example.com/team/payments');
    page.repositoryForm.controls.repositoryName.setValue('payments-api');
    page.nextPhase();
    fixture.detectChanges();
    expect(compiled.querySelector('#has-additional-resources')).toBeTruthy();
    expect(compiled.querySelector('#resource-type')).toBeNull();

    page.resourcesForm.controls.hasAdditionalResources.setValue(true);
    fixture.detectChanges();
    expect(compiled.querySelector('#resource-type')).toBeTruthy();
    expect(compiled.querySelector('#resource-configuration')).toBeTruthy();
    expect(compiled.querySelector('.iac-review')?.textContent).toContain(
      'Nenhum código IaC foi gerado',
    );

    page.resourcesForm.controls.hasAdditionalResources.setValue(false);
    fixture.detectChanges();
    expect(compiled.querySelector('.iac-review')).toBeNull();
  });

  it('preserves form values when navigating between phases', () => {
    const fixture = createPage();
    const page = fixture.componentInstance;

    page.serviceForm.controls.serviceName.setValue('payments-api');
    page.serviceForm.controls.namespace.setValue('payments');
    page.nextPhase();
    page.platformForm.controls.kubernetesTarget.setValue('eks');
    fixture.detectChanges();

    page.previousPhase();
    fixture.detectChanges();

    expect(page.currentPhase()).toBe(0);
    expect(page.serviceForm.getRawValue()).toMatchObject({
      serviceName: 'payments-api',
      namespace: 'payments',
    });
  });

  it('blocks forward navigation on invalid required fields and exposes errors', () => {
    const fixture = createPage();
    const page = fixture.componentInstance;
    const compiled = fixture.nativeElement as HTMLElement;

    page.nextPhase();
    fixture.detectChanges();

    expect(page.currentPhase()).toBe(0);
    expect(compiled.querySelector('#service-name')?.getAttribute('aria-invalid')).toBe(
      'true',
    );
    expect(compiled.querySelector('#service-name-error')?.textContent).toContain(
      'obrigatório',
    );

    page.serviceForm.controls.serviceName.setValue('payments-api');
    page.serviceForm.controls.namespace.setValue('payments');
    page.nextPhase();
    fixture.detectChanges();

    expect(page.currentPhase()).toBe(1);
    expect(compiled.querySelector('#kubernetes-target')).toBeTruthy();
  });

  it('requires resource details only when additional resources are selected', () => {
    const fixture = createPage();
    const page = fixture.componentInstance;

    page.currentPhase.set(4);
    expect(page.resourcesForm.valid).toBe(true);

    page.resourcesForm.controls.hasAdditionalResources.setValue(true);
    page.onResourceChoiceChange();
    expect(page.resourcesForm.controls.resourceType.hasError('required')).toBe(true);

    page.resourcesForm.controls.hasAdditionalResources.setValue(false);
    page.onResourceChoiceChange();
    expect(page.resourcesForm.controls.resourceType.hasError('required')).toBe(false);
    expect(page.resourcesForm.valid).toBe(true);
  });

  it('announces five phases and updates the accessible current step', () => {
    const fixture = createPage();
    const page = fixture.componentInstance;
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('.phase-progress li')).toHaveLength(5);
    expect(compiled.querySelector('.phase-progress')?.getAttribute('aria-label')).toBe(
      'Etapas da criação do projeto',
    );
    expect(compiled.querySelector('[aria-current="step"] .phase-label')?.textContent).toContain(
      'Informações do serviço',
    );

    page.serviceForm.controls.serviceName.setValue('payments-api');
    page.serviceForm.controls.namespace.setValue('payments');
    compiled.querySelector<HTMLButtonElement>('.primary-button')?.click();
    fixture.detectChanges();

    expect(compiled.querySelectorAll('[aria-current="step"]')).toHaveLength(1);
    expect(compiled.querySelector('[aria-current="step"] .phase-label')?.textContent).toContain(
      'Plataforma',
    );
    expect(compiled.querySelector<HTMLButtonElement>('.secondary-button')?.tabIndex).toBe(0);
  });

  it('submits only the active valid phase and reports pending and success', () => {
    const execution = new Subject<ProjectCreationExecutionResult>();
    const submissions: ProjectCreationSubmission[] = [];
    const execute = (submission: ProjectCreationSubmission) => {
      submissions.push(submission);
      return execution.asObservable();
    };

    TestBed.configureTestingModule({
      imports: [ProjectCreationPage],
      providers: [
        {
          provide: ProjectCreationExecutionService,
          useValue: { execute },
        },
      ],
    });
    const fixture = TestBed.createComponent(ProjectCreationPage);
    fixture.detectChanges();
    const page = fixture.componentInstance;

    page.serviceForm.patchValue({
      serviceName: 'payments-api',
      namespace: 'payments',
      description: 'Payment processing',
      responsibleTeam: 'payments',
    });
    page.executeCurrentPhase();
    fixture.detectChanges();

    expect(page.currentPhase()).toBe(0);
    expect(page.activeExecution()?.status).toBe('pending');
    expect(submissions).toEqual([
      {
        phase: 'service',
        data: {
          serviceName: 'payments-api',
          namespace: 'payments',
          description: 'Payment processing',
          responsibleTeam: 'payments',
        },
      },
    ]);

    execution.next({ status: 'success', message: 'Etapa concluída.' });
    fixture.detectChanges();
    expect(page.activeExecution()).toEqual({
      status: 'success',
      message: 'Etapa concluída.',
    });
  });

  it('reports unavailable when no execution operation is configured', () => {
    const fixture = createPage();
    const page = fixture.componentInstance;
    page.serviceForm.patchValue({
      serviceName: 'payments-api',
      namespace: 'payments',
    });

    page.executeCurrentPhase();
    fixture.detectChanges();

    expect(page.currentPhase()).toBe(0);
    expect(page.activeExecution()?.status).toBe('unavailable');
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('.execution-message')
        ?.textContent,
    ).toContain('não está integrada');
  });

  it('displays a failed execution result without leaving the active phase', () => {
    const execution = new Subject<ProjectCreationExecutionResult>();
    TestBed.configureTestingModule({
      imports: [ProjectCreationPage],
      providers: [
        {
          provide: ProjectCreationExecutionService,
          useValue: { execute: () => execution.asObservable() },
        },
      ],
    });
    const fixture = TestBed.createComponent(ProjectCreationPage);
    fixture.detectChanges();
    const page = fixture.componentInstance;

    page.serviceForm.patchValue({
      serviceName: 'payments-api',
      namespace: 'payments',
    });
    page.executeCurrentPhase();
    execution.next({ status: 'failed', message: 'A etapa falhou.' });
    fixture.detectChanges();

    expect(page.currentPhase()).toBe(0);
    expect(page.activeExecution()?.status).toBe('failed');
    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        '.execution-message[role="alert"]',
      )?.textContent,
    ).toContain('A etapa falhou.');
  });

  it('does not execute invalid forms and exposes observable execution errors', () => {
    let calls = 0;
    TestBed.configureTestingModule({
      imports: [ProjectCreationPage],
      providers: [
        {
          provide: ProjectCreationExecutionService,
          useValue: {
            execute: () => {
              calls += 1;
              return throwError(() => new Error('Serviço temporariamente indisponível.'));
            },
          },
        },
      ],
    });
    const fixture = TestBed.createComponent(ProjectCreationPage);
    fixture.detectChanges();
    const page = fixture.componentInstance;

    page.executeCurrentPhase();
    expect(calls).toBe(0);

    page.serviceForm.patchValue({
      serviceName: 'payments-api',
      namespace: 'payments',
    });
    page.executeCurrentPhase();
    fixture.detectChanges();

    expect(calls).toBe(1);
    expect(page.activeExecution()).toEqual({
      status: 'failed',
      message: 'Serviço temporariamente indisponível.',
    });
  });
});
