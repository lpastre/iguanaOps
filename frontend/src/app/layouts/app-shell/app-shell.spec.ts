import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppShell } from './app-shell';
import { AuthService } from '../../core/auth/auth.service';

describe('AppShell', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppShell],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            signOut: () => undefined,
          },
        },
      ],
    }).compileComponents();
  });

  it('exposes keyboard-operable navigation and a controlled mobile menu', () => {
    const fixture = TestBed.createComponent(AppShell);
    fixture.detectChanges();

    const menuButton = fixture.nativeElement.querySelector(
      '.menu-toggle',
    ) as HTMLButtonElement;
    const navigation = fixture.nativeElement.querySelector(
      '#primary-navigation',
    ) as HTMLElement;

    expect(menuButton.type).toBe('button');
    expect(menuButton.getAttribute('aria-controls')).toBe('primary-navigation');
    expect(menuButton.getAttribute('aria-expanded')).toBe('false');
    expect(navigation.getAttribute('aria-label')).toBe('Navegação principal');
    expect(navigation.querySelectorAll('a')).toHaveLength(3);

    menuButton.focus();
    expect(document.activeElement).toBe(menuButton);
    menuButton.click();
    fixture.detectChanges();

    expect(menuButton.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.nativeElement.querySelector('.sidebar').classList).toContain(
      'is-open',
    );
  });
});
