import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = new BehaviorSubject<Theme>('light');
  public theme$ = this.currentTheme.asObservable();

  constructor() {}

  public initializeTheme(): void {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    this.setTheme(theme);
  }

  setTheme(theme: Theme): void {
    this.currentTheme.next(theme);
    
    // Only run in browser environment
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', theme);
      
      const htmlElement = document.documentElement;
      htmlElement.setAttribute('data-theme', theme);
      
      if (theme === 'dark') {
        htmlElement.classList.add('dark-theme');
        htmlElement.classList.remove('light-theme');
      } else {
        htmlElement.classList.add('light-theme');
        htmlElement.classList.remove('dark-theme');
      }
    }
  }

  toggleTheme(): void {
    const currentTheme = this.currentTheme.value;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  getCurrentTheme(): Theme {
    return this.currentTheme.value;
  }
}
