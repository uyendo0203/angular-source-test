import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';
import type { Observable } from 'rxjs';
import type { Theme } from '../../../services/theme.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatTableModule, MatIconModule, RouterModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class ProductsComponent {
  displayedColumns: string[] = ['id', 'name', 'price', 'actions'];
  dataSource = [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 }
  ];
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
