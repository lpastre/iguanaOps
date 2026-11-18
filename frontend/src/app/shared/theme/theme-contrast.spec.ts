import { TestBed } from '@angular/core/testing';
import { ThemeService, type AppTheme } from './theme.service';

function linearize(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function luminance(color: string): number {
  const hex = color.replace('#', '');
  const channels = [0, 2, 4].map((offset) =>
    linearize(Number.parseInt(hex.slice(offset, offset + 2), 16) / 255),
  );
  return (
    (channels[0] ?? 0) * 0.2126 +
    (channels[1] ?? 0) * 0.7152 +
    (channels[2] ?? 0) * 0.0722
  );
}

function contrastRatio(foreground: string, background: string): number {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a,
  );
  return ((lighter ?? 0) + 0.05) / ((darker ?? 0) + 0.05);
}

describe('theme color contrast', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  it.each<AppTheme>(['light', 'dark'])(
    'keeps normal muted text at WCAG AA contrast in %s mode',
    (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      TestBed.inject(ThemeService);

      const styles = getComputedStyle(document.documentElement);
      const foreground = styles.getPropertyValue('--color-text-muted').trim();
      const background = styles.getPropertyValue('--color-canvas').trim();

      expect(foreground).toMatch(/^#[0-9a-f]{6}$/i);
      expect(background).toMatch(/^#[0-9a-f]{6}$/i);
      expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5);
    },
  );
});
