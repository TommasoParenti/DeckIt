import { computed, signal } from '@angular/core';
import { Word } from '../core/models';
import { finalize, Observable, of, tap } from 'rxjs';

type WordPage = { words: Word[]; total: number };
type FetchPage = (offset: number, limit: number) => Observable<WordPage>;

export class PagedWordList {
  private _words = signal<Word[]>([]);
  private _total = signal(0);
  private _loading = signal(false);
  private _loaded = signal(false);
  private pageSize = 20;
  private requestId = 0;

  readonly words = this._words.asReadonly();
  readonly total = this._total.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isLoaded = this._loaded.asReadonly();
  readonly hasMore = computed(() => this._words().length < this._total());

  load(fetchPage: FetchPage, pageSize = 20, force = false): Observable<WordPage> {
    if (this._loaded() && !force) 
      return of({ words: this._words(), total: this._total() });

    this.pageSize = pageSize;
    this._loading.set(true);
    const requestId = ++this.requestId;

    return fetchPage(0, pageSize).pipe(
      tap(({ words, total }) => {
        if (requestId !== this.requestId) 
          return;
        this._words.set(words);
        this._total.set(total);
        this._loaded.set(true);
      }),
      finalize(() => {
        if (requestId === this.requestId) 
          this._loading.set(false);
      })
    );
  }

  loadMore(fetchPage: FetchPage): Observable<WordPage> {
    if (!this.hasMore() || this._loading()) 
      return of({ words: this._words(), total: this._total() });

    const offset = this._words().length;
    this._loading.set(true);
    const requestId = ++this.requestId;

    return fetchPage(offset, this.pageSize).pipe(
      tap(({ words, total }) => {
        if (requestId !== this.requestId) 
          return;
        this._words.update(list => [...list, ...words]);
        this._total.set(total);
      }),
      finalize(() => {
        if (requestId === this.requestId) 
          this._loading.set(false);
      })
    );
  }

  find(id: string): Word | undefined {
    return this._words().find(w => w.id === id);
  }

  add(word: Word): void {
    this._words.update(list => [word, ...list]);
    this._total.update(t => t + 1);
  }

  update(id: string, updated: Word): void {
    this._words.update(list => list.map(w => (w.id === id ? updated : w)));
  }

  remove(id: string): void {
    const existed = this._words().some(w => w.id === id);
    this._words.update(list => list.filter(w => w.id !== id));
    if (existed) 
      this._total.update(t => t - 1);
  }

  reset(): void {
    this._words.set([]);
    this._total.set(0);
    this._loaded.set(false);
    this.requestId++;
  }
}