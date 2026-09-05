import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-category-card',
  imports: [],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss'
})
export class CategoryCardComponent {
  icon = input.required<string | null>();
  bgColor = input.required<string  | null>();
  name = input.required<string>();
  description = input.required<string | null>();
  nWords = input.required<number | null>();

  cardClick = output<void>();

  onCardClick(): void {
    this.cardClick.emit();
  }
}