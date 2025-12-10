import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule, Router } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';
import { AuthService, type User } from '../../../services/auth.service';
import type { Observable } from 'rxjs';
import type { Theme } from '../../../services/theme.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    RouterModule
  ],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss',
})
export class HomepageComponent {
  public currentTheme$: Observable<Theme>;
  public themeService: ThemeService;
  public currentUser$: Observable<User | null>;
  public authService: AuthService;

  constructor(_themeService: ThemeService, _authService: AuthService, private router: Router) {
    this.themeService = _themeService;
    this.authService = _authService;
    this.currentTheme$ = this.themeService.theme$;
    this.currentUser$ = this.authService.currentUser$;
  }

  onToggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
