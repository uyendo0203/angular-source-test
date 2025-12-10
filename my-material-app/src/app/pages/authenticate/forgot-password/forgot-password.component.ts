import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
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
    MatIconModule,
    RouterModule
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  resetForm: FormGroup;
  isLoading = false;
  step: 'email' | 'reset' = 'email';
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onForgotSubmit(): void {
    if (this.forgotForm.valid) {
      this.isLoading = true;

      setTimeout(() => {
        const { email } = this.forgotForm.value;
        const response = this.authService.forgotPassword(email);

        this.isLoading = false;

        if (response.success) {
          this.snackBar.open(response.message, 'Close', { duration: 3000 });
          this.step = 'reset';
        } else {
          this.snackBar.open(response.message, 'Close', { duration: 3000 });
        }
      }, 500);
    }
  }

  onResetSubmit(): void {
    if (this.resetForm.valid) {
      this.isLoading = true;

      setTimeout(() => {
        const email = this.forgotForm.get('email')?.value;
        const { password } = this.resetForm.value;
        const response = this.authService.resetPassword(email, password);

        this.isLoading = false;

        if (response.success) {
          this.snackBar.open(response.message, 'Close', { duration: 3000 });
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 1000);
        } else {
          this.snackBar.open(response.message, 'Close', { duration: 3000 });
        }
      }, 500);
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  goBack(): void {
    this.step = 'email';
    this.resetForm.reset();
  }
}
