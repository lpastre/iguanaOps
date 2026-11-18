import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginPage } from './login-page';
import { AuthService } from '../../core/auth/auth.service';

describe('LoginPage', () => {
  it('starts Keycloak sign-in without collecting credentials', () => {
    const signIn = vi.fn();
    const navigateByUrl = vi.fn();
    TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        {
          provide: AuthService,
          useValue: { signIn, mockSignIn: vi.fn() },
        },
        {
          provide: Router,
          useValue: { navigateByUrl },
        },
      ],
    });

    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector(
      '.sign-in-button',
    ) as HTMLButtonElement;

    button.click();

    expect(button.textContent).toContain('Entrar com Keycloak');
    expect(signIn).toHaveBeenCalledWith('/');
  });

  it('provides a temporary button that mocks authentication', () => {
    const mockSignIn = vi.fn();
    const navigateByUrl = vi.fn();
    TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        {
          provide: AuthService,
          useValue: { signIn: vi.fn(), mockSignIn },
        },
        {
          provide: Router,
          useValue: { navigateByUrl },
        },
      ],
    });

    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector(
      '.mock-sign-in-button',
    ) as HTMLButtonElement;

    button.click();

    expect(button.textContent).toContain('Entrar sem autenticação');
    expect(mockSignIn).toHaveBeenCalledOnce();
    expect(navigateByUrl).toHaveBeenCalledWith('/');
  });
});
