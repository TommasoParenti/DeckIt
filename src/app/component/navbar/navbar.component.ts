import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, viewChild, viewChildren, output, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ResponsiveModalComponent } from '../responsive-modal/responsive-modal.component';
import { MobileService } from '../../services/mobile.service';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from '../../services/categories.service';
import { KanaKeyboardComponent } from '../kana-keyboard/kana-keyboard.component';
import { WordsService } from '../../services/words.service';
import { WordInsert } from '../../core/models';
import { AuthService } from '../../services/auth-service/auth.service';

const SMALL_YOON = new Set(['ゃ', 'ゅ', 'ょ', 'ャ', 'ュ', 'ョ']);
const SOKUON = new Set(['っ', 'ッ']);
const CHOONPU = 'ー';

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, ResponsiveModalComponent, FormsModule, KanaKeyboardComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  protected mobileService = inject(MobileService);
  private destroyRef = inject(DestroyRef);
  protected categoriesService = inject(CategoriesService);
  protected wordsService = inject(WordsService);
  private auth = inject(AuthService);

  readonly navItems: NavItem[] = [
    { path: '/vocabulary', icon: 'ti-book', label: 'Vocabulary' },
    { path: '/categories', icon: 'ti-layout-grid', label: 'Categories' },
    { path: '/flashcards', icon: 'ti-cards', label: 'Flashcards' },
    { path: '/statistics', icon: 'ti-chart-bar', label: 'Statistics' },
  ];

  // Placeholder stats. Once the backend exists, these should stop being plain fields and instead come from injected services
  nDays = 0;
  nInteractions = signal(3);
  readonly maxReps = 5;

  progressPercent = computed(() => Math.min(100, Math.round((this.nInteractions() * 100) / this.maxReps)));
  readonly searchTerm = signal('');
  readonly search = output<string>();

  private static readonly MOBILE_GLIDER_INSET = 4;

  private readonly desktopGlider = viewChild<ElementRef<HTMLElement>>('desktopGlider');
  private readonly mobileGlider = viewChild<ElementRef<HTMLElement>>('mobileGlider');
  private readonly desktopLinks = viewChildren<ElementRef<HTMLElement>>('desktopLink');
  private readonly mobileTabs = viewChildren<ElementRef<HTMLElement>>('mobileTab');
  private readonly desktopNav = viewChild<ElementRef<HTMLElement>>('desktopNav');
  private readonly mobileNavContainer = viewChild<ElementRef<HTMLElement>>('mobileNavContainer');

  isAddWordModalOpen = signal(false);
  isKeyboardOpen = signal(false);

  newWordType: 'kanji' | 'katakana' | 'hiragana' = 'hiragana';
  newWordText = '';
  newWordTranslation = '';
  newWordDescription = '';
  newWordCategory: string = "";
  spellingChars: string[] = [];

  constructor() {
    afterNextRender(() => {
      this.repositionDesktopGlider();
      this.repositionMobileGlider();
      this.observeResize();
    });
  }

  private observeResize(): void {
    if (!("ResizeObserver" in window)) return;

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
    return list.find(el => el.nativeElement.classList.contains("active"))?.nativeElement;
  }

  openAddWordModal(): void {
    this.resetForm();
    this.isAddWordModalOpen.set(true);
  }

  onWordTextChange(value: string): void {
    this.newWordText = value;
    const units = splitIntoKanaUnits(value);
    this.spellingChars = units.map((_, i) => this.spellingChars[i] ?? '');
  }

  isFormValid(): boolean {
    return (
      this.newWordText.trim().length > 0 &&
      this.newWordTranslation.trim().length > 0 &&
      this.newWordCategory.trim().length > 0 &&
      this.spellingChars.every(c => c.trim().length > 0)
    );
  }

  onAddWord(): void {
    const user = this.auth.user();
    if (!user) return;
    if (!this.isFormValid()) return;

    const newWord: WordInsert = {
      kanji: this.newWordType == "kanji" ? this.newWordText : null,
      hiragana: this.newWordType == "hiragana" ? this.newWordText : null,
      katakana: this.newWordType == "katakana" ? this.newWordText : null,
      translation: this.newWordTranslation.trim(),
      description: this.newWordDescription.trim(),
      spelling: this.spellingChars,
      category: this.newWordCategory,
      user_id: user.id
    };
    this.wordsService.create(newWord).subscribe({
      next: () => {
        this.resetForm();
        this.isAddWordModalOpen.set(false);
      },
      error: (err) => console.error("Error", err)
    });
  }

  private resetForm(): void {
    this.newWordType = "hiragana";
    this.newWordText = "";
    this.newWordTranslation = "";
    this.newWordDescription = "";
    this.newWordCategory = "";
    this.spellingChars = [];
  }

  onSearchInput(value: string): void {
    this.searchTerm.set(value);
    this.search.emit(value);
    // TODO(backend): wire up to VocabularyService.search() once it exists;
  }
}

function splitIntoKanaUnits(value: string): string[] {
  const chars = Array.from(value ?? '');
  const units: string[] = [];
  let i = 0;
  while (i < chars.length) {
    let unit = chars[i];
    i++;
    if (SOKUON.has(unit) && i < chars.length) {
      unit += chars[i];
      i++;
    }
    while (i < chars.length && SMALL_YOON.has(chars[i])) {
      unit += chars[i];
      i++;
    }
    while (i < chars.length && chars[i] === CHOONPU) {
      unit += chars[i];
      i++;
    }
    units.push(unit);
  }
  return units;
}