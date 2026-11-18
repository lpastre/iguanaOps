import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

export type AppTheme = 'light' | 'dark';

const themeTokens: Record<AppTheme, Readonly<Record<string, string>>> = {
  light: {
    '--color-canvas': '#f4f6fb',
    '--color-surface': '#ffffff',
    '--color-surface-muted': '#edf1f8',
    '--color-text': '#19243a',
    '--color-text-muted': '#5f6c83',
    '--color-border': '#dce3ee',
    '--color-primary': '#2359d1',
    '--color-primary-strong': '#1948b4',
    '--color-primary-soft': '#e8efff',
    '--color-success': '#18794e',
    '--color-warning': '#9a5b00',
    '--color-danger': '#b42318',
    '--shadow-card': '0 12px 32px rgb(23 39 69 / 7%)',
  },
  dark: {
    '--color-canvas': '#101725',
    '--color-surface': '#182235',
    '--color-surface-muted': '#202c41',
    '--color-text': '#f2f5fb',
    '--color-text-muted': '#b1bdd0',
    '--color-border': '#34425a',
    '--color-primary': '#9ab8ff',
    '--color-primary-strong': '#c1d2ff',
    '--color-primary-soft': '#263b63',
    '--color-success': '#79d6a5',
    '--color-warning': '#f4bd63',
    '--color-danger': '#ff9a91',
    '--shadow-card': '0 12px 32px rgb(0 0 0 / 20%)',
  },
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  readonly theme = signal<AppTheme>(
    this.document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'dark'
      : 'light',
  );

  constructor() {
    this.applyTheme(this.theme());
  }

  toggle(): void {
    const nextTheme: AppTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(nextTheme);
    this.applyTheme(nextTheme);
  }

  private applyTheme(theme: AppTheme): void {
    const root = this.document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;

    for (const [token, value] of Object.entries(themeTokens[theme])) {
      root.style.setProperty(token, value);
    }
  }
}
