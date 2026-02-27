import { Injectable } from '@angular/core';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: User | null = null;

  login(username: string, password: string): boolean {
    
    if (username === 'admin' && password === 'admin') {
      this.currentUser = { username: 'admin', role: 'admin' };
      return true;
    }

    if (username === 'cliente' && password === 'cliente') {
      this.currentUser = { username: 'cliente', role: 'cliente' };
      return true;
    }
    return false;
  }

  logout() {
    this.currentUser = null;
  }

  getUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }
}
