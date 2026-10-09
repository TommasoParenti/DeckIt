import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';

const PRESS_FEEDBACK_MS = 150;

@Component({
  selector: 'app-category-card',
  imports: [],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss'
})
export class CategoryCardComponent {
  icon = input.required<string | null>();
  bgColor = input.required<string | null>();
  name = input.required<string>();
  nWords = input.required<number | null>();

  cardClick = output<void>();

  protected readonly pressed = signal(false);
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      if (this.timer) clearTimeout(this.timer);
    });
  }

  onCardClick(): void {
    if (this.pressed()) return; 

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.cardClick.emit();
      return;
    }

    this.pressed.set(true);
    this.timer = setTimeout(() => {
      this.cardClick.emit();
      this.pressed.set(false);
    }, PRESS_FEEDBACK_MS);
  }
}