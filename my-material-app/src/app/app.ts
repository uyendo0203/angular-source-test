import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  public themeService: ThemeService;
  public authService: AuthService;

  constructor(_themeService: ThemeService, _authService: AuthService) {
    this.themeService = _themeService;
    this.authService = _authService;
  }

  ngOnInit(): void {
    this.themeService.initializeTheme();
    // Refresh auth state when app initializes (supports multi-tab login)
    this.authService.refreshAuthState();
  }
}
