import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './unauthorized-dialog.html',
  styleUrl: './unauthorized-dialog.scss'
})
export class UnauthorizedDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UnauthorizedDialogComponent>,
    private router: Router
  ) {}

  onLogin(): void {
    this.dialogRef.close();
    this.router.navigate(['/auth/login']);
  }

  onRegister(): void {
    this.dialogRef.close();
    this.router.navigate(['/auth/register']);
  }
}
