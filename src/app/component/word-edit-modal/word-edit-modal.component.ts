import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResponsiveModalComponent } from '../responsive-modal/responsive-modal.component';
import { KanaKeyboardComponent } from '../kana-keyboard/kana-keyboard.component';
import { WordsService } from '../../services/words.service';
import { CategoriesService } from '../../services/categories.service';
import { MobileService } from '../../services/mobile.service';
import { Word } from '../../core/models';
import { splitIntoKanaUnits } from '../../shared/kana.util';
import { ScriptMode } from '../../shared/kana.types';

@Component({
  selector: 'app-word-edit-modal',
  standalone: true,
  imports: [FormsModule, ResponsiveModalComponent, KanaKeyboardComponent],
  templateUrl: './word-edit-modal.component.html',
  styleUrl: './word-edit-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordEditModalComponent {
  private wordsService = inject(WordsService);
  protected categoriesService = inject(CategoriesService);
  protected mobileService = inject(MobileService);

  open = input.required<boolean>();
  openChange = output<boolean>();
  word = input<Word | null>(null);
  saved = output<void>();

  isKeyboardOpen = signal(false);
  text = '';
  spellingChars: string[] = [];
  translation = '';
  description = '';
  categoryId = '';
  wordType: ScriptMode = 'hiragana';

  constructor() {
    effect(() => {
      if (!this.open()) return;
      const w = this.word();
      if (!w) return;
      this.text = w.kanji ?? w.katakana ?? w.hiragana ?? '';
      this.wordType = w.kanji ? 'kanji' : w.katakana ? 'katakana' : 'hiragana';
      this.spellingChars = [...(w.spelling ?? [])];
      this.translation = w.translation;
      this.description = w.description ?? '';
      this.categoryId = w.category ?? '';
    });
  }

  onWordTextChange(value: string): void {
    this.text = value;
    const units = splitIntoKanaUnits(value);
    this.spellingChars = units.map((_, i) => this.spellingChars[i] ?? '');
  }

  isFormValid(): boolean {
    return (
      this.text.trim() !== '' &&
      this.translation.trim() !== '' &&
      this.categoryId !== '' &&
      this.spellingChars.every(c => c.trim().length > 0)
    );
  }

  onSave(): void {
    const w = this.word();
    if (!w || !this.isFormValid()) return;

    const updated = {
      ...w,
      kanji: this.wordType == "kanji" ? this.text : null,
      hiragana: this.wordType == "hiragana" ? this.text : null,
      katakana: this.wordType == "katakana" ? this.text : null,
      translation: this.translation,
      description: this.description,
      category: this.categoryId,
      spelling: this.spellingChars,
    };

    this.wordsService.update(w.id, updated).subscribe({
      next: () => this.saved.emit(),
      error: (err) => console.error('Error:', err)
    });
  }
}