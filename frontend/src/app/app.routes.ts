import { Routes } from '@angular/router';
import { DashboardPage } from './features/dashboard/dashboard-page';
import { AppShell } from './layouts/app-shell/app-shell';
import { LoginPage } from './features/auth/login-page';
import { CallbackPage } from './features/auth/callback-page';
import { PlaceholderPage } from './features/placeholder/placeholder-page';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'callback', component: CallbackPage },
  {
    path: '',
    component: AppShell,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: DashboardPage,
      },
      {
        path: 'projects',
        component: PlaceholderPage,
        data: {
          title: 'Criar Projeto indisponível',
          description:
            'A criação de projetos ainda não está disponível nesta versão.',
        },
      },
      {
        path: 'workflows',
        component: PlaceholderPage,
        data: {
          title: 'Criar Workflow indisponível',
          description:
            'A criação de workflows ainda não está disponível nesta versão.',
        },
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
