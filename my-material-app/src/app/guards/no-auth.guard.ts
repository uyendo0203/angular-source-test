import { Injectable } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      return true;
    }

    // If already logged in, redirect to home
    this.router.navigate(['/main/home']);
    return false;
  }
}

export const noAuthGuard: CanActivateFn = (route, state) => {
  return inject(NoAuthGuard).canActivate();
};
