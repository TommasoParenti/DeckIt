import { inject, Injectable, signal } from '@angular/core';
import { finalize, Observable, of, tap } from 'rxjs';
import { Category, CategoryInsert } from '../core/models';
import { CategoryService } from './data-service/category.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private categoryService = inject(CategoryService);

  private _categories = signal<Category[]>([]);
  private _loading = signal(true);
  private _loaded = signal(false);
  private currentUserId: string | null = null;

  categories = this._categories.asReadonly();
  loading = this._loading.asReadonly();
  loaded = this._loaded.asReadonly();

  load(userId: string, force = false): Observable<Category[]> {
    const sameContext = this._loaded() && this.currentUserId === userId;
    if (sameContext && !force) {
      return of(this._categories());
    }

    this.currentUserId = userId;
    this._loading.set(true);

    return this.categoryService.getByUserId(userId).pipe(
      tap(categories => {
        this._categories.set(categories);
        this._loaded.set(true);
      }),
      finalize(() => this._loading.set(false))
    );
  }

  create(category: CategoryInsert): Observable<Category> {
    return this.categoryService.create(category).pipe(
      tap(created => this._categories.update(list => [...list, created]))
    );
  }

  delete(userId: string, name: string): Observable<void> {
    return this.categoryService.delete(userId, name).pipe(
      tap(() => this._categories.update(list => list.filter(c => c.name !== name)))
    );
  }

  update(userId: string, name: string, changes: Partial<CategoryInsert>): Observable<Category> {
    return this.categoryService.update(userId, name, changes).pipe(
      tap(updated => this._categories.update(list =>
        list.map(c => c.name === name ? updated : c)
      ))
    );
  }

  updateWordsCount(category: string | null, n: number): void {
    if (!category) return;
    this._categories.update(list =>
      list.map(c => c.name === category ? { ...c, words_count: (c.words_count ?? 0) + n } : c)
    );
  }

  reset(): void {
    this._categories.set([]);
    this._loaded.set(false);
    this.currentUserId = null;
  }
}