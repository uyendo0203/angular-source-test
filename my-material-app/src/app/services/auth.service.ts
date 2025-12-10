import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from './cookie.service';

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
  providedIn: 'root',
})
export class AuthService {
  private mockUsers: User[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      password: 'password123',
    },
    {
      id: '3',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'admin123',
    },
  ];

  private currentUser = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUser.asObservable();

  private isAuthenticated = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticated.asObservable();

  private readonly CURRENT_USER_COOKIE = 'currentUser';
  private readonly AUTH_TOKEN_COOKIE = 'authToken';
  private readonly USERS_COOKIE = 'users';
  private readonly COOKIE_EXPIRY_DAYS = 7;

  constructor(private cookieService: CookieService) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    if (typeof window === 'undefined') {
      this.initializeMockUsers();
      return;
    }

    try {
      const savedUser = this.cookieService.getCookie(this.CURRENT_USER_COOKIE);
      const token = this.cookieService.getCookie(this.AUTH_TOKEN_COOKIE);
      
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
  }  private initializeMockUsers(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const existingUsers = this.cookieService.getCookie(this.USERS_COOKIE);
      if (!existingUsers) {
        this.cookieService.setCookie(
          this.USERS_COOKIE,
          JSON.stringify(this.mockUsers),
          this.COOKIE_EXPIRY_DAYS
        );
      }
    } catch (error) {
      console.error('Error initializing mock users:', error);
    }
  }

  login(email: string, password: string): LoginResponse {
    const users = this.getAllUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      const token = this.generateToken(user);

      if (typeof window !== 'undefined') {
        try {
          this.cookieService.setCookie(
            this.CURRENT_USER_COOKIE,
            JSON.stringify(user),
            this.COOKIE_EXPIRY_DAYS
          );
          this.cookieService.setCookie(
            this.AUTH_TOKEN_COOKIE,
            token,
            this.COOKIE_EXPIRY_DAYS
          );
        } catch (error) {
          console.error('Error saving to cookies:', error);
        }
      }

      this.currentUser.next(user);
      this.isAuthenticated.next(true);

      return {
        success: true,
        message: 'Login successful',
        user,
        token,
      };
    }

    return {
      success: false,
      message: 'Invalid email or password',
    };
  }

  register(firstName: string, lastName: string, email: string, password: string): LoginResponse {
    const users = this.getAllUsers();

    if (users.some((u) => u.email === email)) {
      return {
        success: false,
        message: 'Email already exists',
      };
    }

    const newUser: User = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      password,
    };

    users.push(newUser);

    if (typeof window !== 'undefined') {
      try {
        this.cookieService.setCookie(
          this.USERS_COOKIE,
          JSON.stringify(users),
          this.COOKIE_EXPIRY_DAYS
        );
      } catch (error) {
        console.error('Error saving users:', error);
      }
    }

    return {
      success: true,
      message: 'Registration successful. Please login.',
      user: newUser,
    };
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      try {
        this.cookieService.deleteCookie(this.CURRENT_USER_COOKIE);
        this.cookieService.deleteCookie(this.AUTH_TOKEN_COOKIE);
      } catch (error) {
        console.error('Error clearing cookies:', error);
      }
    }

    this.currentUser.next(null);
    this.isAuthenticated.next(false);
  }

  forgotPassword(email: string): LoginResponse {
    const users = this.getAllUsers();
    const user = users.find((u) => u.email === email);

    if (user) {
      if (typeof window !== 'undefined') {
        try {
          const resetToken = this.generateToken(user);
          this.cookieService.setCookie(
            `reset_${email}`,
            resetToken,
            1
          );
        } catch (error) {
          console.error('Error saving reset token:', error);
        }
      }

      return {
        success: true,
        message: 'Password reset link sent to your email',
      };
    }

    return {
      success: false,
      message: 'Email not found',
    };
  }

  resetPassword(email: string, newPassword: string): LoginResponse {
    const users = this.getAllUsers();
    const user = users.find((u) => u.email === email);

    if (user) {
      user.password = newPassword;

      if (typeof window !== 'undefined') {
        try {
          this.cookieService.setCookie(
            this.USERS_COOKIE,
            JSON.stringify(users),
            this.COOKIE_EXPIRY_DAYS
          );
          this.cookieService.deleteCookie(`reset_${email}`);
        } catch (error) {
          console.error('Error resetting password:', error);
        }
      }

      return {
        success: true,
        message: 'Password reset successfully',
      };
    }

    return {
      success: false,
      message: 'User not found',
    };
  }

  getCurrentUser(): User | null {
    return this.currentUser.value;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated.value;
  }

  private getAllUsers(): User[] {
    if (typeof window === 'undefined') {
      return this.mockUsers;
    }

    try {
      const users = this.cookieService.getCookie(this.USERS_COOKIE);
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
        message: 'No user logged in',
      };
    }

    user.firstName = firstName;
    user.lastName = lastName;

    if (typeof window !== 'undefined') {
      try {
        this.cookieService.setCookie(
          this.CURRENT_USER_COOKIE,
          JSON.stringify(user),
          this.COOKIE_EXPIRY_DAYS
        );

        const users = this.getAllUsers();
        const index = users.findIndex((u) => u.id === user.id);
        if (index !== -1) {
          users[index] = user;
          this.cookieService.setCookie(
            this.USERS_COOKIE,
            JSON.stringify(users),
            this.COOKIE_EXPIRY_DAYS
          );
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }

    this.currentUser.next(user);

    return {
      success: true,
      message: 'Profile updated successfully',
      user,
    };
  }

  // Refresh auth state - called when a new tab is opened
  refreshAuthState(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const savedUser = this.cookieService.getCookie(this.CURRENT_USER_COOKIE);
      const token = this.cookieService.getCookie(this.AUTH_TOKEN_COOKIE);

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
