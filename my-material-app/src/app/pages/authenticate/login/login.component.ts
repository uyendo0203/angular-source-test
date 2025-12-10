import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  public authService: AuthService;

  mockCredentials = [
    { email: 'john@example.com', password: 'password123', name: 'John Doe' },
    { email: 'jane@example.com', password: 'password123', name: 'Jane Smith' },
    { email: 'admin@example.com', password: 'admin123', name: 'Admin User' }
  ];

  constructor(
    private fb: FormBuilder,
    _authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.authService = _authService;
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      submit: [{ value: '', disabled: true }]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      setTimeout(() => {
        const { email, password } = this.loginForm.value;
        const response = this.authService.login(email, password);

        this.isLoading = false;

        if (response.success) {
          this.snackBar.open(response.message, 'Close', { duration: 3000 });
          this.router.navigate(['/main/home']);
        } else {
          this.snackBar.open(response.message, 'Close', { duration: 3000 });
        }
      }, 500);
    }
  }

  fillCredentials(email: string, password: string): void {
    this.loginForm.patchValue({
      email,
      password
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
