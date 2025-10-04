import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';
import { User, LoginRequest, RegisterRequest, AuthResponse, AuthState } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://jsonplaceholder.typicode.com'; // Mock API
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredAuth();
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Mock login - in real app, this would be your actual API endpoint
            const mockResponse: AuthResponse = {
              token: 'mock_jwt_token_' + Date.now(),
              user: {
                id: 1,
                email: credentials.email,
                firstName: 'John',
                lastName: 'Doe',
                phone: '+1234567890',
                address: '123 Main St',
                role: credentials.email === 'admin@ecommerce.com' ? 'admin' : 'user',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              },
              expiresIn: 3600
            };

    return new Promise((resolve) => {
      setTimeout(() => {
        this.setAuthState(mockResponse);
        resolve(mockResponse);
      }, 1000);
    });
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Mock registration
            const mockResponse: AuthResponse = {
              token: 'mock_jwt_token_' + Date.now(),
              user: {
                id: 2,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                phone: userData.phone,
                role: 'user',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              },
              expiresIn: 3600
            };

    return new Promise((resolve) => {
      setTimeout(() => {
        this.setAuthState(mockResponse);
        resolve(mockResponse);
      }, 1000);
    });
  }


  async isAuthenticated(): Promise<boolean> {
    const token = await Preferences.get({ key: this.TOKEN_KEY });
    return !!token.value;
  }

  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  getToken(): string | null {
    return this.authStateSubject.value.token;
  }

  private async setAuthState(authResponse: AuthResponse): Promise<void> {
    await Preferences.set({
      key: this.TOKEN_KEY,
      value: authResponse.token
    });

    await Preferences.set({
      key: this.USER_KEY,
      value: JSON.stringify(authResponse.user)
    });

    this.authStateSubject.next({
      isAuthenticated: true,
      user: authResponse.user,
      token: authResponse.token
    });
  }

  private async loadStoredAuth(): Promise<void> {
    try {
      const tokenResult = await Preferences.get({ key: this.TOKEN_KEY });
      const userResult = await Preferences.get({ key: this.USER_KEY });

      if (tokenResult.value && userResult.value) {
        const user = JSON.parse(userResult.value);
        this.authStateSubject.next({
          isAuthenticated: true,
          user: user,
          token: tokenResult.value
        });
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    }
  }

  async logout(): Promise<void> {
    try {
      // Remove stored data
      await Preferences.remove({ key: this.TOKEN_KEY });
      await Preferences.remove({ key: this.USER_KEY });

      // Update auth state
      this.authStateSubject.next({
        isAuthenticated: false,
        user: null,
        token: null
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}

