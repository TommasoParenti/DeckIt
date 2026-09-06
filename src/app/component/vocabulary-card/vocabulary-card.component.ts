import { Component, computed, inject, input, model, output } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-vocabulary-card',
  imports: [],
  templateUrl: './vocabulary-card.component.html',
  styleUrl: './vocabulary-card.component.scss'
})
export class VocabularyCardComponent {
  private categoriesService = inject(CategoriesService);

  category = input('');
  word = input('');
  translation = input('');
  description = input('');
  spelling = input<string[]>([]);
  categoryColor = computed(() => { return this.categoriesService.categories().find(c => c.name === this.category())?.color ?? '6c757d' })

  isFavorite = model(false);
  cardClick = output<void>();

  toggleStar(event: Event): void {
    event.stopPropagation();
    this.isFavorite.set(!this.isFavorite());
  }

  onCardClick(): void {
    this.cardClick.emit();
  }
}