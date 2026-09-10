import { Injectable } from '@angular/core';
import { catchError, from, map, Observable, throwError } from 'rxjs';
import { Category, CategoryInsert, CategoryUpdate } from '../../core/models';
import { supabase } from '../../core/supabase.client';
import { sanitizeNulls } from '../../core/supabase-utils';

const UNIQUE_VIOLATION = '23505';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  getAll(): Observable<Category[]> {
    return from(supabase.from('categories').select('*')).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []).map(category => sanitizeNulls(category));
      })
    );
  }

  getByUserId(userId: string): Observable<Category[]> {
    return from(supabase.from('categories').select('*').eq('user_id', userId)).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []).map(category => sanitizeNulls(category));
      })
    );
  }

  getByName(userId: string, name: string): Observable<Category | null> {
    return from(supabase.from('categories').select('*').eq('user_id', userId).eq('name', name).maybeSingle()).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data ? sanitizeNulls(data) : null;
      })
    );
  }

  create(category: CategoryInsert): Observable<Category> {
    return from(supabase.from('categories').insert(category).select().single()).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return sanitizeNulls(data);
      }),
      catchError(error => {
        if (error?.code === UNIQUE_VIOLATION) {
          console.error(`Already exist "${category.name}".`);
        } else {
          console.error('Error:', error);
        }
        return throwError(() => error);
      })
    );
  }

  update(userId: string, name: string, changes: CategoryUpdate): Observable<Category> {
    return from(supabase.from('categories').update(changes).eq('user_id', userId).eq('name', name).select().single()).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return sanitizeNulls(data);
      }),
      catchError(error => {
        if (error?.code === UNIQUE_VIOLATION) {
          console.error(`No rename "${name}": already exists "${changes.name}".`);
        } else {
          console.error('Error:', error);
        }
        return throwError(() => error);
      })
    );
  }

  delete(userId: string, name: string): Observable<void> {
    return from(supabase.from('categories').delete().eq('user_id', userId).eq('name', name)).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }
}