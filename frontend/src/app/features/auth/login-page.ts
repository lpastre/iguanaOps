import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  signIn(): void {
    this.auth.signIn('/');
  }

  mockSignIn(): void {
    this.auth.mockSignIn();
    void this.router.navigateByUrl('/');
  }
}
