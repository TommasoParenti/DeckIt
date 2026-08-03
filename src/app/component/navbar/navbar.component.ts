import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, viewChild, viewChildren, output, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {

  readonly navItems: NavItem[] = [
    { path: '/vocabulary', icon: 'bi-book', label: 'Vocabulary' },
    { path: '/categories', icon: 'bi-grid', label: 'Categories' },
    { path: '/flashcards', icon: 'bi-collection', label: 'Flashcards' },
    { path: '/statistics', icon: 'bi-graph-up', label: 'Statistics' },
  ];

  readonly addWord = output<void>();

  // Placeholder stats. Once the backend exists, these should stop being plain fields and instead come from injected services
  nWords = 0;
  nCategories = 0;
  nDays = 0;
  nInteractions = signal(3);
  readonly maxReps = 5;

  progressPercent = computed(() => Math.min(100, Math.round((this.nInteractions() * 100) / this.maxReps)));

  private static readonly MOBILE_GLIDER_INSET = 4;

  private readonly desktopGlider = viewChild<ElementRef<HTMLElement>>('desktopGlider');
  private readonly mobileGlider = viewChild<ElementRef<HTMLElement>>('mobileGlider');
  private readonly desktopLinks = viewChildren<ElementRef<HTMLElement>>('desktopLink');
  private readonly mobileTabs = viewChildren<ElementRef<HTMLElement>>('mobileTab');
  private readonly desktopNav = viewChild<ElementRef<HTMLElement>>('desktopNav');
  private readonly mobileNavContainer = viewChild<ElementRef<HTMLElement>>('mobileNavContainer');

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      this.repositionDesktopGlider();
      this.repositionMobileGlider();
      this.observeResize();
    });
  }

  private observeResize(): void {
    if (!('ResizeObserver' in window)) return;

    const targets = [this.desktopNav()?.nativeElement, this.mobileNavContainer()?.nativeElement]
      .filter((el): el is HTMLElement => !!el);
    if (targets.length === 0) return;

    const observer = new ResizeObserver(() => {
      this.repositionDesktopGlider();
      this.repositionMobileGlider();
    });

    targets.forEach(el => observer.observe(el));
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  repositionDesktopGlider(): void {
    const glider = this.desktopGlider()?.nativeElement;
    if (!glider || glider.offsetParent === null) return;

    const active = this.findActive(this.desktopLinks());
    if (!active) return;

    glider.style.transform = `translateY(${active.offsetTop}px)`;
    glider.style.height = `${active.offsetHeight}px`;
  }

  repositionMobileGlider(): void {
    const glider = this.mobileGlider()?.nativeElement;
    if (!glider || glider.offsetParent === null) return;

    const active = this.findActive(this.mobileTabs());
    if (!active) return;

    const inset = NavbarComponent.MOBILE_GLIDER_INSET;
    glider.style.top = `${inset}px`;
    glider.style.bottom = `${inset}px`;
    glider.style.transform = `translateX(${active.offsetLeft - inset}px)`;
    glider.style.width = `${active.offsetWidth + inset * 2}px`;
  }

  private findActive(list: readonly ElementRef<HTMLElement>[]): HTMLElement | undefined {
    return list.find(el => el.nativeElement.classList.contains('active'))?.nativeElement;
  }

  onAddWord(): void {
    // TODO(backend): once StreakService exists, call
    // streakService.registerInteraction() here too (adding a word should
    // count as a rep, same as reviewing a flashcard).
    this.addWord.emit();
  }
}