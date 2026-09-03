import { inject, Injectable, signal, Signal } from '@angular/core';
import { supabase } from '../../core/supabase.client';
import { CategoriesService } from '../categories.service';
import { User } from '@supabase/supabase-js';
import { WordsService } from '../words.service';
import { Subscription, take } from 'rxjs';

const APP_EMAIL = 'tommaso10parenti@gmail.com';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private categoriesService = inject(CategoriesService);
  private wordsService = inject(WordsService)

  private _user = signal<User | null>(null);
  user: Signal<User | null> = this._user.asReadonly();

  private categoriesSub?: Subscription;
  private wordsSub?: Subscription;

  constructor() {
    supabase.auth.onAuthStateChange((event, session) => {
      this._user.set(session?.user ?? null);
      switch (event) {
        case 'SIGNED_OUT':
          this.categoriesSub?.unsubscribe();
          this.wordsSub?.unsubscribe();
          this.categoriesService.reset();
          this.wordsService.reset();
          break;
        case 'SIGNED_IN':
        case 'INITIAL_SESSION':
          if (session?.user) {
            this.loadUserData(session.user.id);
          }
          break;
      }
    });
  }

  private loadUserData(userId: string): void {
    this.categoriesSub?.unsubscribe();
    this.wordsSub?.unsubscribe();

    this.categoriesSub = this.categoriesService.load(userId, true)
      .pipe(take(1))
      .subscribe({
        error: err => console.error('Error loading categories:', err)
      });

    this.wordsSub = this.wordsService.load(userId, 20, true)
      .pipe(take(1))
      .subscribe({
        error: err => console.error('Error loading words:', err)
      });
  }

  login(password: string) {
    return supabase.auth.signInWithPassword({ email: APP_EMAIL, password })
      .then(({ data, error }) => {
        if (error) {
          console.error('Error during login:', error.message);
        }
        return { data, error };
      });
  }

  async isAuthenticated(): Promise<boolean> {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  }

  logout() {
    return supabase.auth.signOut();
  }
}