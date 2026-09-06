import { Component, computed, effect, HostListener, inject, input, model, signal, untracked } from '@angular/core';
import { MobileService } from '../../services/mobile.service';

@Component({
  selector: 'app-responsive-modal',
  standalone: true,
  templateUrl: './responsive-modal.component.html',
  styleUrl: './responsive-modal.component.scss',
  host: {
    '(document:keydown.escape)': 'onEscape()',
  }
})
export class ResponsiveModalComponent {
  protected mobileService = inject(MobileService);

  open = model(false);
  minTranslateY = input(200);
  handleBc = input(true);
  showFooter = input(false);
  showActionBar = input(true);
  
  readonly isDragging = signal(false);
  readonly isClosing = signal(false);
  readonly translateY = signal(0);
  readonly sheetTransform = computed(() => this.mobileService.isMobile() ? `translateY(${this.translateY()}px)` : '');
  private startY = 0;
  private startTranslateY = 0;

  private backdropMouseDownTarget: EventTarget | null = null;
  
  constructor() {
    effect(() => {
      document.body.style.overflow = this.open() ? 'hidden' : '';
    });

    effect(() => {
      if (!this.open()) {
        return;
      }

      if (untracked(() => this.mobileService.isMobile())) {
        this.isDragging.set(false);
        this.isClosing.set(false);
        this.translateY.set(this.mobileService.getWindowHeight()); 
        requestAnimationFrame(() => {
          requestAnimationFrame(() => this.setPartial());
        });
      }
    });
  }

  close(): void {
    if (this.mobileService.isMobile() && !this.isClosing()) {
      this.dragToClose();
      return;
    }
    this.open.set(false);
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget && this.backdropMouseDownTarget === event.currentTarget) {
      this.close();
    }
  }

  onBackdropMouseDown(event: MouseEvent): void {
    this.backdropMouseDownTarget = event.target;
  }

  onModalClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  onTouchStart(event: TouchEvent): void {
    if (!this.mobileService.isMobile()) {
      return;
    }

    this.startY = event.touches[0].clientY;
    this.startTranslateY = this.translateY();

    this.isDragging.set(true);
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging() || !this.mobileService.isMobile()) return;

    const currentY = event.touches[0].clientY;
    const deltaY = currentY - this.startY;
    let position = this.startTranslateY + deltaY;

    position = Math.max(this.minTranslateY(), Math.min(position, window.innerHeight));

    this.translateY.set(position);
    event.preventDefault();
  }

  onTouchEnd(): void {
    if (!this.isDragging() || !this.mobileService.isMobile()) return;
    this.isDragging.set(false);

    const partialPosition = window.innerHeight * 0.5;
    const closeThreshold = partialPosition + 100;

    if (this.translateY() > closeThreshold) {
      this.dragToClose();
      return;
    }

    this.setPartial();
  }

  private dragToClose(): void {
    this.isClosing.set(true);
    this.translateY.set(window.innerHeight);
    setTimeout(() => this.close(), 300);
  }

  setPartial(): void {
    if(this.minTranslateY() == 0) {
      this.translateY.set(0);
    } else {
      this.translateY.set(window.innerHeight * 0.5 - 150);
    }
  }

  onEscape(): void {
    if (this.open()) {
      this.close();
    }
  }
}