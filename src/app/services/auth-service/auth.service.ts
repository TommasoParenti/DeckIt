import { Injectable } from '@angular/core';
import { supabase } from '../../core/supabase.client';

const APP_EMAIL = 'tommaso10parenti@gmail.com';

@Injectable({ providedIn: 'root' })
export class AuthService {
  login(password: string) {
    return supabase.auth.signInWithPassword({ email: APP_EMAIL, password });
  }

  async isAuthenticated(): Promise<boolean> {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  }

  logout() {
    return supabase.auth.signOut();
  }
}