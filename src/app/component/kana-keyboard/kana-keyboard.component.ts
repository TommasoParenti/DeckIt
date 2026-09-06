import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, computed, effect, inject, input, model, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { MobileService } from '../../services/mobile.service';
import { hiraganaRows, katakanaRows, hiraganaDakuten, katakanaDakuten, hiraganaSokuon, katakanaSokuon, chouonpu, hiraganaYoon, katakanaYoon } from '../../shared/kana.data';
import { KanaCell, KanaRow, KanjiEntry } from '../../shared/kana.types';
import { KanjiService } from '../../services/kanji.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

type ScriptMode = 'kanji' | 'katakana' | 'hiragana';

const MAX_KANJI_RESULTS = 100;
const SEARCH_DEBOUNCE_MS = 150;

@Component({
  selector: 'app-kana-keyboard',
  imports: [LoadingSpinnerComponent],
  templateUrl: './kana-keyboard.component.html',
  styleUrl: './kana-keyboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscape()',
    '(document:mousedown)': 'onDocumentMousedown($event)',
  },
})
export class KanaKeyboardComponent {
  private mobileService = inject(MobileService);
  private elementRef = inject(ElementRef<HTMLElement>);
  private destroyRef = inject(DestroyRef);
  protected kanjiService = inject(KanjiService);

  open = model(false);
  value = model('');
  mode = model<ScriptMode>('hiragana');

  targetEl = input<HTMLInputElement | undefined>();
  toggleEl = input<HTMLElement | undefined>();

  isMobile = computed(() => this.mobileService.isMobile());
  readonly top = signal<string | null>(null);

  readonly activeRows = computed<KanaRow[]>(() => this.mode() === 'katakana' ? katakanaRows : hiraganaRows);
  readonly activeDakuten = computed<KanaCell[]>(() => this.mode() === 'katakana' ? katakanaDakuten : hiraganaDakuten);
  readonly activeDakutenRows = computed<KanaRow[]>(() => this.chunkIntoRows(this.activeDakuten(), 5));
  readonly activeSokuon = computed<KanaCell>(() => this.mode() === 'katakana' ? katakanaSokuon : hiraganaSokuon);
  readonly specialKeys = computed<KanaCell[]>(() => [this.activeSokuon(), chouonpu]);
  readonly activeYoon = computed<KanaCell[]>(() => this.mode() === 'katakana' ? katakanaYoon : hiraganaYoon);
  readonly activeYoonRows = computed<KanaRow[]>(() => this.chunkIntoRows(this.activeYoon(), 3));

  private readonly kanjis = signal<KanjiEntry[]>([]);
  readonly kanjiLoadError = signal(false);

  readonly kanjiSearch = signal('');
  private readonly debouncedKanjiSearch = toSignal(
    toObservable(this.kanjiSearch).pipe(debounceTime(SEARCH_DEBOUNCE_MS)),
    { initialValue: '' }
  );

  readonly filteredKanji = computed(() => {
    const q = this.debouncedKanjiSearch().trim().toLowerCase();
    const bank = this.kanjis();
    if (!q) return bank.slice(0, MAX_KANJI_RESULTS);
    return bank
      .filter(k =>
        k.readings_on.some(r => r.toLowerCase().includes(q)) ||
        k.readings_kun.some(r => r.toLowerCase().includes(q)) ||
        k.meanings.some(m => m.toLowerCase().includes(q))
      )
      .slice(0, MAX_KANJI_RESULTS);
  });

  constructor() {
    effect(() => {
      const isOpen = this.open();
      const mobile = this.isMobile();
      if (!isOpen || mobile) {
        this.top.set(null);
        return;
      }
      this.updateTopPosition();
    });

    let rafId: number | null = null;
    const onScrollOrResize = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (this.open() && !this.isMobile()) this.updateTopPosition();
      });
    };
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
    });
  }

  private chunkIntoRows(cells: KanaCell[], size: number): KanaRow[] {
    const rows: KanaRow[] = [];
    for (let i = 0; i < cells.length; i += size) {
      rows.push(cells.slice(i, i + size));
    }
    return rows;
  }

  setMode(m: ScriptMode): void {
    this.mode.set(m);
    if (m === 'kanji' && this.kanjis().length === 0) {
      this.loadKanji();
    }
  }

  loadKanji(): void {
    this.kanjiLoadError.set(false);
    this.kanjiService.load()
      .then(data => this.kanjis.set(data))
      .catch(() => this.kanjiLoadError.set(true));
  }

  close(): void {
    this.open.set(false);
  }

  insertChar(ch: string | null): void {
    if (!ch) return;
    const current = this.value() ?? '';
    this.value.set(current + ch);
  }

  backspace(): void {
    const current = this.value() ?? '';
    if (!current) return;
    this.value.set(current.slice(0, -1));
  }

  space(): void {
    this.insertChar('　');
  }

  onKanjiSearchChange(value: string): void {
    this.kanjiSearch.set(value);
  }

  onEscape(): void {
    if (this.open()) this.close();
  }

  onDocumentMousedown(event: MouseEvent): void {
    if (!this.open()) return;
    const target = event.target as Node | null;
    if (!target) return;

    if (this.elementRef.nativeElement.contains(target)) return;

    const targetInput = this.targetEl();
    if (targetInput && (targetInput === target || targetInput.contains(target))) return;

    const toggle = this.toggleEl();
    if (toggle && (toggle === target || toggle.contains(target))) return;

    this.close();
  }

  private updateTopPosition(): void {
    const el = this.targetEl();
    if (!el) return;

    const rect = el.getBoundingClientRect();
    this.top.set(rect.bottom + 20 + "px");
  }
}