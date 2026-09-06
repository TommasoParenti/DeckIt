import { ChangeDetectionStrategy, Component, computed, inject, input, model, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ResponsiveModalComponent } from '../responsive-modal/responsive-modal.component';
import { HoldButtonComponent } from '../hold-button/hold-button.component';
import { WordsService } from '../../services/words.service';
import { CategoriesService } from '../../services/categories.service';
import { Word } from '../../core/models';

@Component({
  selector: 'app-word-detail-modal',
  imports: [ResponsiveModalComponent, HoldButtonComponent, DatePipe],
  templateUrl: './word-detail-modal.component.html',
  styleUrl: './word-detail-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordDetailModalComponent {
  private wordsService = inject(WordsService);
  private categoriesService = inject(CategoriesService);

  open = model.required<boolean>();
  word = input<Word | null>(null);

  edit = output<void>();
  deleted = output<void>();
  isFavorite = signal(false);

  selectedChars = computed(() => {
    const w = this.word();
    if (!w) return [];
    return Array.from(w.kanji ?? w.katakana ?? w.hiragana ?? '');
  });

  categoryColor = computed(() => {
    const w = this.word();
    if (!w) return '6c757d';
    return this.categoriesService.categories().find(c => c.name === w.category)?.color;
  });

  toggleStar(event: Event): void {
    event.stopPropagation();
    this.isFavorite.set(!this.isFavorite());
  }

  onDelete(): void {
    const w = this.word();
    if (!w) return;
    this.wordsService.delete(w.id).subscribe({
      next: () => {
        this.open.set(false);
        this.deleted.emit();
      },
      error: (err) => console.error('Error:', err)
    });
  }
}