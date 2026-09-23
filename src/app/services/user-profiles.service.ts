import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserProfile, UserProfileUpdate } from '../core/models';
import { UserProfileService } from './data-service/user-profile.service';

const DAILY_ACTIONS_THRESHOLD = 3;

function todayISODate(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
}

@Injectable({
  providedIn: 'root'
})
export class UserProfilesService {
  private readonly userProfileService = inject(UserProfileService);

  private readonly _profile = signal<UserProfile | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<unknown>(null);

  readonly profile = this._profile.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly streakDays = computed(() => this._profile()?.streak_days ?? 0);
  readonly flashcardsUse = computed(() => this._profile()?.flashcards_use ?? 0);
  readonly dailyActionsCount = computed(() => this._profile()?.daily_actions_count ?? 0);
  readonly dailyActionsDate = computed(() => this._profile()?.daily_actions_date ?? null);
  readonly lastActiveAt = computed(() => this._profile()?.last_active_at ?? null);

  readonly isStreakSecuredToday = computed(() => this.lastActiveAt() === todayISODate());

  readonly actionsCountedToday = computed(() =>
    this.dailyActionsDate() === todayISODate() ? this.dailyActionsCount() : 0
  );

  readonly actionsRemainingToday = computed(() =>
    Math.max(DAILY_ACTIONS_THRESHOLD - this.actionsCountedToday(), 0)
  );

  readonly streakProgressToday = computed(() =>
    Math.min(this.actionsCountedToday() / DAILY_ACTIONS_THRESHOLD, 1)
  );

  load(id: string): Observable<UserProfile> {
    this._loading.set(true);
    this._error.set(null);

    return this.userProfileService.getById(id).pipe(
      tap({
        next: (profile) => {
          this._profile.set(profile);
          this._loading.set(false);
        },
        error: (err) => {
          this._error.set(err);
          this._loading.set(false);
        }
      })
    );
  }

  refresh(): Observable<UserProfile> {
    const id = this.requireId();
    return this.load(id);
  }

  update(changes: UserProfileUpdate): Observable<UserProfile> {
    const id = this.requireId();
    return this.userProfileService.update(id, changes).pipe(
      tap((profile) => this._profile.set(profile))
    );
  }

  incrementFlashcardsUse(): Observable<UserProfile> {
    return this.userProfileService.incrementFlashcardsUse().pipe(
      tap((profile) => this._profile.set(profile))
    );
  }

  logAction(): Observable<UserProfile> {
    return this.userProfileService.logAction().pipe(
      tap((profile) => this._profile.set(profile))
    );
  }

  delete(): Observable<void> {
    const id = this.requireId();
    return this.userProfileService.delete(id).pipe(
      tap(() => this._profile.set(null))
    );
  }

  clear(): void {
    this._profile.set(null);
    this._error.set(null);
    this._loading.set(false);
  }

  private requireId(): string {
    const id = this._profile()?.id;
    if (!id) {
      throw new Error('UserProfileStore: nessun profilo caricato, chiama load(id) prima.');
    }
    return id;
  }
}