import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RequestDataService } from './request-data.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements OnInit, OnDestroy {
  readonly requests = inject(RequestDataService);

  ngOnInit(): void {
    this.requests.load();
    this.requests.connectLiveUpdates();
  }

  ngOnDestroy(): void {
    this.requests.disconnectLiveUpdates();
  }

  retry(): void {
    this.requests.load();
  }

  progressLabel(progress: number): string {
    return `${Math.min(100, Math.max(0, progress))}%`;
  }
}
