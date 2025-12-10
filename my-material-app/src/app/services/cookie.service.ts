import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  constructor() {}

  /**
   * Set a cookie
   * @param name Cookie name
   * @param value Cookie value
   * @param days Days until expiration (optional)
   */
  setCookie(name: string, value: string, days: number = 7): void {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    
    let cookieString = `${name}=${encodeURIComponent(value)}`;
    cookieString += `; expires=${date.toUTCString()}`;
    cookieString += '; path=/';
    cookieString += '; SameSite=Strict';
    
    if (typeof document !== 'undefined') {
      document.cookie = cookieString;
    }
  }

  /**
   * Get a cookie value
   */
  getCookie(name: string): string | null {
    if (typeof document === 'undefined') {
      return null;
    }

    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(nameEQ)) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }
    
    return null;
  }

  /**
   * Delete a cookie
   */
  deleteCookie(name: string): void {
    this.setCookie(name, '', -1);
  }

  /**
   * Check if cookie exists
   */
  hasCookie(name: string): boolean {
    return this.getCookie(name) !== null;
  }

  /**
   * Get all cookies as an object
   */
  getAllCookies(): Record<string, string> {
    const cookies: Record<string, string> = {};
    
    if (typeof document === 'undefined') {
      return cookies;
    }

    const allCookies = document.cookie.split(';');
    
    for (let cookie of allCookies) {
      cookie = cookie.trim();
      if (cookie) {
        const [name, value] = cookie.split('=');
        cookies[name] = decodeURIComponent(value || '');
      }
    }
    
    return cookies;
  }
}
