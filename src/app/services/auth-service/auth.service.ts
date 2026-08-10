import { inject, Injectable } from '@angular/core';
import { supabase } from '../../core/supabase.client';
import { Router } from '@angular/router';

const APP_EMAIL = 'tommaso10parenti@gmail.com';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);

  constructor() {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        this.router.navigateByUrl('/login');
      }
    });
  }

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