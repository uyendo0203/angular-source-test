import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private mockUsers: User[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123'
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      password: 'password123'
    },
    {
      id: '3',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'admin123'
    }
  ];

  private currentUser = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUser.asObservable();

  private isAuthenticated = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticated.asObservable();

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      this.initializeMockUsers();
      return;
    }

    try {
      const savedUser = localStorage.getItem('currentUser');
      const token = localStorage.getItem('authToken');
      
      if (savedUser && token) {
        const user = JSON.parse(savedUser);
        this.currentUser.next(user);
        this.isAuthenticated.next(true);
      } else {
        this.initializeMockUsers();
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      this.initializeMockUsers();
    }
  }

  private initializeMockUsers(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    try {
      const existingUsers = localStorage.getItem('users');
      if (!existingUsers) {
        localStorage.setItem('users', JSON.stringify(this.mockUsers));
      }
    } catch (error) {
      console.error('Error initializing mock users:', error);
    }
  }

  login(email: string, password: string): LoginResponse {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      const token = this.generateToken(user);
      
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('authToken', token);
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }
      }
      
      this.currentUser.next(user);
      this.isAuthenticated.next(true);

      return {
        success: true,
        message: 'Login successful',
        user,
        token
      };
    }

    return {
      success: false,
      message: 'Invalid email or password'
    };
  }

  register(firstName: string, lastName: string, email: string, password: string): LoginResponse {
    const users = this.getAllUsers();
    
    if (users.some(u => u.email === email)) {
      return {
        success: false,
        message: 'Email already exists'
      };
    }

    const newUser: User = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      password
    };

    users.push(newUser);

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('users', JSON.stringify(users));
      } catch (error) {
        console.error('Error saving users:', error);
      }
    }

    return {
      success: true,
      message: 'Registration successful. Please login.',
      user: newUser
    };
  }

  logout(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    }
    
    this.currentUser.next(null);
    this.isAuthenticated.next(false);
  }

  forgotPassword(email: string): LoginResponse {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email);

    if (user) {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        try {
          const resetToken = this.generateToken(user);
          localStorage.setItem(`reset_${email}`, resetToken);
        } catch (error) {
          console.error('Error saving reset token:', error);
        }
      }

      return {
        success: true,
        message: 'Password reset link sent to your email'
      };
    }

    return {
      success: false,
      message: 'Email not found'
    };
  }

  resetPassword(email: string, newPassword: string): LoginResponse {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email);

    if (user) {
      user.password = newPassword;

      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem('users', JSON.stringify(users));
          localStorage.removeItem(`reset_${email}`);
        } catch (error) {
          console.error('Error resetting password:', error);
        }
      }

      return {
        success: true,
        message: 'Password reset successfully'
      };
    }

    return {
      success: false,
      message: 'User not found'
    };
  }

  getCurrentUser(): User | null {
    return this.currentUser.value;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated.value;
  }

  private getAllUsers(): User[] {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return this.mockUsers;
    }

    try {
      const users = localStorage.getItem('users');
      return users ? JSON.parse(users) : this.mockUsers;
    } catch (error) {
      console.error('Error getting users:', error);
      return this.mockUsers;
    }
  }

  private generateToken(user: User): string {
    return btoa(`${user.email}:${Date.now()}`);
  }

  getUserProfile(): User | null {
    return this.currentUser.value;
  }

  updateUserProfile(firstName: string, lastName: string): LoginResponse {
    const user = this.currentUser.value;

    if (!user) {
      return {
        success: false,
        message: 'No user logged in'
      };
    }

    user.firstName = firstName;
    user.lastName = lastName;

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        const users = this.getAllUsers();
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          users[index] = user;
          localStorage.setItem('users', JSON.stringify(users));
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }

    this.currentUser.next(user);

    return {
      success: true,
      message: 'Profile updated successfully',
      user
    };
  }

  // Refresh auth state - called when a new tab is opened
  refreshAuthState(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    try {
      const savedUser = localStorage.getItem('currentUser');
      const token = localStorage.getItem('authToken');
      
      if (savedUser && token) {
        const user = JSON.parse(savedUser);
        this.currentUser.next(user);
        this.isAuthenticated.next(true);
      } else {
        this.currentUser.next(null);
        this.isAuthenticated.next(false);
      }
    } catch (error) {
      console.error('Error refreshing auth state:', error);
      this.currentUser.next(null);
      this.isAuthenticated.next(false);
    }
  }
}
