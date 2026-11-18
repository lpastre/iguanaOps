import { TestBed } from '@angular/core/testing';
import { ThemeToggle } from './theme-toggle';
import { ThemeService } from './theme.service';

describe('ThemeToggle', () => {
  beforeEach(async () => {
    document.documentElement.removeAttribute('data-theme');
    await TestBed.configureTestingModule({
      imports: [ThemeToggle],
    }).compileComponents();
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  it('toggles the document theme and exposes its state accessibly', () => {
    const fixture = TestBed.createComponent(ThemeToggle);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe('Ativar tema escuro');
    expect(button.getAttribute('aria-pressed')).toBe('false');

    button.click();
    fixture.detectChanges();

    expect(TestBed.inject(ThemeService).theme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(button.getAttribute('aria-label')).toBe('Ativar tema claro');
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });
});
