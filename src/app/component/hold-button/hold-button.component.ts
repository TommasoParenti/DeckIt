import { booleanAttribute, Component, computed, DestroyRef, effect, inject, input, numberAttribute, output, signal } from '@angular/core';

@Component({
  selector: 'app-hold-button',
  imports: [],
  templateUrl: './hold-button.component.html',
  styleUrl: './hold-button.component.scss'
})
export class HoldButtonComponent {
  icon = input('ti ti-trash');
  color = input('danger');

  holdDuration = input(900, { transform: numberAttribute });
  disabled = input(false, { transform: booleanAttribute });
  
  holdComplete = output<void>();
  holdStart = output<void>();
  holdCancel = output<void>();

  readonly holding = signal(false);
  readonly classes = computed(() => `btn-icon hold-btn text-${this.color()}`);
  private holdTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      if (this.holdTimeout) clearTimeout(this.holdTimeout);
    });

    effect(() => {
      if (this.disabled() && this.holding()) {
        this.cancelHold();
      }
    });
  }
 
  startHold(): void {
    if (this.disabled() || this.holding()) {
      return;
    }
    this.holding.set(true);
    this.holdStart.emit();
    this.holdTimeout = setTimeout(() => {
      this.holdTimeout = null;
      this.holding.set(false);
      this.holdComplete.emit();
    }, this.holdDuration());
  }
 
  cancelHold(): void {
    if (this.holdTimeout) {
      clearTimeout(this.holdTimeout);
      this.holdTimeout = null;
      this.holding.set(false);
      this.holdCancel.emit();
    }
  }
 
  onKeyDown(event: Event): void {
    event.preventDefault();
    this.startHold();
  }
 
  onKeyUp(event: Event): void {
    event.preventDefault();
    this.cancelHold();
  }
}
