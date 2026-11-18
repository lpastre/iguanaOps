import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-placeholder-page',
  imports: [RouterLink],
  templateUrl: './placeholder-page.html',
  styleUrl: './placeholder-page.scss',
})
export class PlaceholderPage {
  readonly title = signal('Recurso indisponível');
  readonly description = signal(
    'Este recurso ainda não está disponível nesta versão.',
  );

  constructor() {
    const route = inject(ActivatedRoute);
    const data = route.snapshot.data;
    if (typeof data['title'] === 'string') {
      this.title.set(data['title']);
    }
    if (typeof data['description'] === 'string') {
      this.description.set(data['description']);
    }
  }
}
