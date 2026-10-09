import { inject, Injectable, signal, Signal } from '@angular/core';
import { supabase } from '../../core/supabase.client';
import { CategoriesService } from '../categories.service';
import { User } from '@supabase/supabase-js';
import { WordsService } from '../words.service';
import { Subscription, take } from 'rxjs';
import { ToastService } from '../toast-notifications.service';
import { UserProfilesService } from '../user-profiles.service';

const APP_EMAIL = 'tommaso10parenti@gmail.com';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private categoriesService = inject(CategoriesService);
  private wordsService = inject(WordsService);
  private userProfilesService = inject(UserProfilesService);
  private toast = inject(ToastService);

  private _user = signal<User | null>(null);
  user: Signal<User | null> = this._user.asReadonly();

  private categoriesSub?: Subscription;
  private wordsSub?: Subscription;
  private userProfileSub?: Subscription;

  constructor() {
    supabase.auth.onAuthStateChange((event, session) => {
      this._user.set(session?.user ?? null);
      switch (event) {
        case 'SIGNED_OUT':
          this.categoriesSub?.unsubscribe();
          this.wordsSub?.unsubscribe();
          this.userProfileSub?.unsubscribe();
          this.categoriesService.reset();
          this.wordsService.reset();
          this.userProfilesService.reset();
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
    this.userProfileSub?.unsubscribe();

    this.categoriesSub = this.categoriesService.load(userId, true)
      .pipe(take(1))
      .subscribe({
        error: (err) => {
          console.error(err);
          this.toast.error('Could not load the categories. Please try again.');
        }
      });

    this.wordsSub = this.wordsService.load(userId, 20, true)
      .pipe(take(1))
      .subscribe({
        error: (err) => {
          console.error(err);
          this.toast.error('Could not load the words. Please try again.');
        }
      });

    this.userProfileSub = this.userProfilesService.load(userId)
      .pipe(take(1))
      .subscribe({
        error: (err) => {
          console.error(err);
          this.toast.error('Could not load the user profile. Please try again.');
        }
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