import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Word, WordInsert, WordUpdate } from '../core/models';
import { WordService } from './data-service/word.service';
import { CategoriesService } from './categories.service';
import { PagedWordList } from '../shared/paged-word-list';

@Injectable({ providedIn: 'root' })
export class WordsService {
  private wordService = inject(WordService);
  private categoriesService = inject(CategoriesService);

  private allWords = new PagedWordList();
  private categoryWords = new PagedWordList();
  private currentCategory: string | null = null;

  words = this.allWords.words;
  total = this.allWords.total;
  loading = this.allWords.loading;
  hasMore = this.allWords.hasMore;

  wordsByCategory = this.categoryWords.words;
  totalByCategory = this.categoryWords.total;
  loadingByCategory = this.categoryWords.loading;
  hasMoreByCategory = this.categoryWords.hasMore;

  load(userId: string | null, pageSize = 20, force = false) {
    return this.allWords.load(
      (offset: number, limit: number | undefined) => this.wordService.getPage(offset, limit, userId),
      pageSize,
      force
    );
  }

  loadMore(userId: string | null) {
    return this.allWords.loadMore((offset: number, limit: number | undefined) => this.wordService.getPage(offset, limit, userId));
  }

  loadByCategory(category: string, userId: string | null, pageSize = 20, force = false): Observable<{ words: Word[]; total: number }> {
    const changingCategory = this.currentCategory !== category;
    if (changingCategory) {
      this.categoryWords.reset();
    }
    this.currentCategory = category;

    return this.categoryWords.load(
      (offset: number, limit: number | undefined) => this.wordService.getPageByCategory(category, offset, limit, userId),
      pageSize,
      force || changingCategory
    );
  }

  loadMoreByCategory(userId: string | null): Observable<{ words: Word[]; total: number }> {
    if (!this.currentCategory) {
      return of({ words: this.categoryWords.words(), total: this.categoryWords.total() });
    }
    const category = this.currentCategory;
    return this.categoryWords.loadMore((offset: number, limit: number | undefined) =>
      this.wordService.getPageByCategory(category, offset, limit, userId)
    );
  }

  create(word: WordInsert): Observable<Word> {
    return this.wordService.create(word).pipe(
      tap(created => {
        this.allWords.add(created);
        this.categoriesService.updateWordsCount(created.category, 1);

        if (created.category === this.currentCategory) {
          this.categoryWords.add(created);
        }
      })
    );
  }

  update(id: string, changes: WordUpdate): Observable<Word> {
    const previous = this.allWords.find(id) ?? this.categoryWords.find(id);

    return this.wordService.update(id, changes).pipe(
      tap(updated => {
        this.allWords.update(id, updated);

        if (previous && previous.category !== updated.category) {
          this.categoriesService.updateWordsCount(previous.category, -1);
          this.categoriesService.updateWordsCount(updated.category, 1);
        }

        if (this.currentCategory) {
          const wasInCategory = previous?.category === this.currentCategory;
          const isInCategory = updated.category === this.currentCategory;

          if (wasInCategory && isInCategory) {
            this.categoryWords.update(id, updated);
          } else if (wasInCategory && !isInCategory) {
            this.categoryWords.remove(id);
          } else if (!wasInCategory && isInCategory) {
            this.categoryWords.add(updated);
          }
        }
      })
    );
  }

  delete(id: string): Observable<void> {
    const word = this.allWords.find(id) ?? this.categoryWords.find(id);

    return this.wordService.delete(id).pipe(
      tap(() => {
        this.allWords.remove(id);

        if (word) {
          this.categoriesService.updateWordsCount(word.category, -1);
          if (word.category === this.currentCategory) {
            this.categoryWords.remove(id);
          }
        }
      })
    );
  }

  reset(): void {
    this.allWords.reset();
    this.categoryWords.reset();
    this.currentCategory = null;
  }
}