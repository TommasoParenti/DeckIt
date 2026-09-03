import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { KanjiEntry } from '../shared/kana.types';

@Injectable({ providedIn: 'root' })
export class KanjiService {
  private http = inject(HttpClient);
  private cache?: Promise<KanjiEntry[]>;

  readonly loading = signal(false);

  load(): Promise<KanjiEntry[]> {
    if (!this.cache) {
      this.loading.set(true);
      this.cache = firstValueFrom(
        this.http.get<Record<string, Omit<KanjiEntry, 'char'>>>('/assets/kanji_jouyou.json')
      )
        .then(raw => Object.entries(raw).map(([char, data]) => ({ char, ...data })))
        .catch(err => {
          this.cache = undefined;
          throw err;
        })
        .finally(() => this.loading.set(false));
    }
    return this.cache;
  }
}