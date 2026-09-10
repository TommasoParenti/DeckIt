import { Component, computed, inject, input, output } from '@angular/core';
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
  isFavourite = input(false);
  categoryColor = computed(() => this.categoriesService.categories().find(c => c.name === this.category())?.color ?? '6c757d');

  cardClick = output<void>();
  toggleFavourite = output<void>();

  toggleStar(event: Event): void {
    event.stopPropagation();
    this.toggleFavourite.emit();
  }

  onCardClick(): void {
    this.cardClick.emit();
  }
}