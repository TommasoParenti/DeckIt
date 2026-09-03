import { Injectable } from '@angular/core';
import { from, map, Observable, of } from 'rxjs';
import { supabase } from '../../core/supabase.client';
import { sanitizeNulls } from '../../core/supabase-utils';
import { Word, WordInsert, WordUpdate } from '../../core/models';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  getAll(): Observable<Word[]> {
    return from(supabase.from('words').select('*')).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []).map(word => sanitizeNulls(word));
      })
    );
  }

  getPage(offset: number, limit = 20, userId: string | null): Observable<{ words: Word[]; total: number }> {
    if (userId == null) return of({ words: [], total: 0 });
    const rangeTo = offset + limit - 1;
    return from(
      supabase
        .from('words')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('added_at', { ascending: false })
        .range(offset, rangeTo)
    ).pipe(
      map(({ data, error, count }) => {
        if (error) throw error;
        return { words: (data ?? []).map(word => sanitizeNulls(word)), total: count ?? 0 };
      })
    );
  }

  getPageByCategory(category: string, offset: number, limit = 20, userId: string | null): Observable<{ words: Word[]; total: number }> {
    if (userId == null) return of({ words: [], total: 0 });
    const rangeTo = offset + limit - 1;
    return from(
      supabase
        .from('words')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('category', category)
        .order('added_at', { ascending: false })
        .range(offset, rangeTo)
    ).pipe(
      map(({ data, error, count }) => {
        if (error) throw error;
        return { words: (data ?? []).map(word => sanitizeNulls(word)), total: count ?? 0 };
      })
    );
  }

  getById(id: string): Observable<Word> {
    return from(supabase.from('words').select('*').eq('id', id).single()).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return sanitizeNulls(data);
      })
    );
  }

  getByUserId(userId: string): Observable<Word[]> {
    return from(supabase.from('words').select('*').eq('user_id', userId).order('added_at', { ascending: false })).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []).map(word => sanitizeNulls(word));
      })
    );
  }

  getByCategory(category: string): Observable<Word[]> {
    return from(supabase.from('words').select('*').eq('category', category)).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []).map(word => sanitizeNulls(word));
      })
    );
  }

  search(query: string): Observable<Word[]> {
    const safe = query.replace(/[,()%_]/g, '');
    return from(supabase.from('words').select('*').or(`translation.ilike.%${safe}%,hiragana.ilike.%${safe}%,kanji.ilike.%${safe}%`)).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []).map(word => sanitizeNulls(word));
      })
    );
  }

  create(word: WordInsert): Observable<Word> {
    return from(supabase.from('words').insert(word).select().single()).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return sanitizeNulls(data);
      })
    );
  }

  update(id: string, changes: WordUpdate): Observable<Word> {
    return from(supabase.from('words').update(changes).eq('id', id).select().single()).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return sanitizeNulls(data);
      })
    );
  }

  delete(id: string): Observable<void> {
    return from(supabase.from('words').delete().eq('id', id)).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }
}