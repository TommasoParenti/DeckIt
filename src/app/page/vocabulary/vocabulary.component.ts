import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { VocabularyCardComponent } from '../../component/vocabulary-card/vocabulary-card.component';
import { WordDetailModalComponent } from '../../component/word-detail-modal/word-detail-modal.component';
import { WordEditModalComponent } from '../../component/word-edit-modal/word-edit-modal.component';
import { LoadingSpinnerComponent } from '../../component/loading-spinner/loading-spinner.component';
import { LoadMoreButtonComponent } from '../../component/load-more-button/load-more-button.component';
import { MobileService } from '../../services/mobile.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { WordsService } from '../../services/words.service';

@Component({
  selector: 'app-vocabulary',
  imports: [VocabularyCardComponent, WordDetailModalComponent, WordEditModalComponent, LoadingSpinnerComponent, LoadMoreButtonComponent],
  templateUrl: './vocabulary.component.html',
  styleUrl: './vocabulary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VocabularyComponent {
  protected mobileService = inject(MobileService);
  protected wordsService = inject(WordsService);
  private auth = inject(AuthService);

  words = this.wordsService.words;
  hasMore = this.wordsService.hasMore;
  loadingMore = this.wordsService.loading;

  protected isModalOpen = signal(false);
  clicked = signal(-1);
  selectedWordFull = computed(() => this.words()[this.clicked()] ?? null);

  readonly searchTerm = signal('');
  nDays = 0;
  inStreak = false;

  protected isEditWordModalOpen = signal(false);

  constructor() {
    const user = this.auth.user();
    if (!user) return;
    this.wordsService.load(user.id, 20).subscribe({
      error: (err) => console.error('Error:', err)
    });
  }

  loadMore(): void {
    const user = this.auth.user();
    if (!user) return;
    this.wordsService.loadMore(user.id).subscribe({
      error: (err) => console.error('Error:', err)
    });
  }

  openVocabulary(index: number): void {
    this.isModalOpen.set(true);
    this.clicked.set(index);
  }

  editWord(): void {
    this.isModalOpen.set(false);
    setTimeout(() => this.isEditWordModalOpen.set(true), 150);
  }

  onEditModalOpenChange(isOpen: boolean): void {
    this.isEditWordModalOpen.set(isOpen);
    if (!isOpen && this.clicked() !== -1) {
      setTimeout(() => this.isModalOpen.set(true), 150);
    }
  }

  onSearchInput(value: string): void {
    this.searchTerm.set(value);
  }
}