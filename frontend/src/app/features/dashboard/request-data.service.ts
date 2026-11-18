import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

export type RequestStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface PersonalRequest {
  id: string;
  title: string;
  status: RequestStatus;
  progress: number;
  updatedAt: string;
}

export type DashboardState =
  | { kind: 'loading' }
  | { kind: 'ready'; requests: PersonalRequest[] }
  | { kind: 'empty'; requests: PersonalRequest[] }
  | { kind: 'error'; message: string };

export interface RequestProgressEvent {
  requestId: string;
  status: RequestStatus;
  progress: number;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class RequestDataService {
  private readonly http = inject(HttpClient);
  readonly state = signal<DashboardState>({ kind: 'loading' });
  readonly liveUpdatesUnavailable = signal(false);
  private eventSource: EventSource | null = null;

  load(): void {
    this.state.set({ kind: 'loading' });
    this.http
      .get<PersonalRequest[]>('/api/requests', { withCredentials: true })
      .subscribe({
        next: (requests) => {
          this.state.set(
            requests.length
              ? { kind: 'ready', requests }
              : { kind: 'empty', requests: [] },
          );
        },
        error: (error: HttpErrorResponse) => {
          this.state.set({
            kind: 'error',
            message: error.status
              ? 'Não foi possível carregar suas solicitações.'
              : 'O serviço de solicitações está indisponível.',
          });
        },
      });
  }

  connectLiveUpdates(): void {
    if (typeof EventSource === 'undefined') {
      this.liveUpdatesUnavailable.set(true);
      return;
    }

    this.eventSource?.close();
    this.eventSource = new EventSource('/api/requests/events', {
      withCredentials: true,
    });
    this.eventSource.onopen = () => this.liveUpdatesUnavailable.set(false);
    this.eventSource.onerror = () => this.liveUpdatesUnavailable.set(true);
    this.eventSource.onmessage = (message) => {
      try {
        const event = JSON.parse(message.data) as RequestProgressEvent;
        this.applyProgressEvent(event);
      } catch {
        this.liveUpdatesUnavailable.set(true);
      }
    };
  }

  disconnectLiveUpdates(): void {
    this.eventSource?.close();
    this.eventSource = null;
  }

  private applyProgressEvent(event: RequestProgressEvent): void {
    const current = this.state();
    if (current.kind !== 'ready') {
      return;
    }

    const requests = current.requests.map((request) =>
      request.id === event.requestId
        ? {
            ...request,
            status: event.status,
            progress: event.progress,
            updatedAt: event.updatedAt,
          }
        : request,
    );
    this.state.set({ kind: 'ready', requests });
  }
}
