import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';
import type { Observable } from 'rxjs';
import type { Theme } from '../../../services/theme.service';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './customer.html',
  styleUrl: './customer.scss',
})
export class CustomerComponent {
  public currentTheme$: Observable<Theme>;
  public themeService: ThemeService;

  constructor(_themeService: ThemeService) {
    this.themeService = _themeService;
    this.currentTheme$ = this.themeService.theme$;
  }

  onToggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
