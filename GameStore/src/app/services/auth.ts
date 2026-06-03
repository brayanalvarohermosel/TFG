import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { supabase } from './supabase';

/**
 * Manages authentication: login, session restore, and profile auto-creation.
 * The current user is kept in-memory (not in localStorage) for security.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: User | null = null;

  constructor() {}

  /** Called via APP_INITIALIZER so the session restores before the UI renders. */
  async initSession() {
    await this.restoreSession();
  }

  /** Checks Supabase Auth for an existing session (e.g. page refresh) and loads the profile. */
  private async restoreSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await this.loadProfile(session.user.id, session.user.email || '');
    }
  }

  /**
   * Fetches the user's profile from the `profiles` table.
   * If no profile exists yet (first login), creates one automatically
   * with role 'admin' for admin@game.com or 'cliente' otherwise.
   */
  private async loadProfile(userId: string, email: string) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profile) {
      this.currentUser = { id: userId, username: profile.username, role: profile.role };
    } else {
      const username = email.split('@')[0];
      const role = username === 'admin' ? 'admin' : 'cliente';
      await supabase.from('profiles').insert({
        id: userId,
        username,
        role,
      });
      this.currentUser = { id: userId, username, role };
    }
  }

  /** Authenticates with Supabase Auth. Returns true on success. */
  async login(email: string, password: string): Promise<boolean> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) return false;

    await this.loadProfile(data.user.id, email);
    return true;
  }

  /** Signs out and clears the in-memory user. */
  async logout() {
    await supabase.auth.signOut();
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
