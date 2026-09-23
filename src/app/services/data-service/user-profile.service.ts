import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { UserProfile, UserProfileUpdate } from '../../core/models';
import { supabase } from '../../core/supabase.client';
import { sanitizeNulls } from '../../core/supabase-utils';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  getById(id: string): Observable<UserProfile> {
    return from(supabase.from('users').select('*').eq('id', id).single()).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return sanitizeNulls(data);
      })
    );
  }

  update(id: string, changes: UserProfileUpdate): Observable<UserProfile> {
    return from(supabase.from('users').update(changes).eq('id', id).select().single()).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return sanitizeNulls(data);
      })
    );
  }

  incrementFlashcardsUse(): Observable<UserProfile> {
    return from(supabase.rpc('increment_flashcards_use')).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return sanitizeNulls(data);
      })
    );
  }

  logAction(): Observable<UserProfile> {
    return from(supabase.rpc('log_user_action')).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return sanitizeNulls(data);
      })
    );
  }

  delete(id: string): Observable<void> {
    return from(supabase.from('users').delete().eq('id', id)).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }
}