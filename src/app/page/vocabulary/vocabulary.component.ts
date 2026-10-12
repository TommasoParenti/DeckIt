import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { VocabularyCardComponent } from '../../component/vocabulary-card/vocabulary-card.component';
import { WordDetailModalComponent } from '../../component/word-detail-modal/word-detail-modal.component';
import { WordEditModalComponent } from '../../component/word-edit-modal/word-edit-modal.component';
import { LoadingSpinnerComponent } from '../../component/loading-spinner/loading-spinner.component';
import { LoadMoreButtonComponent } from '../../component/load-more-button/load-more-button.component';
import { MobileService } from '../../services/mobile.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { WordsService } from '../../services/words.service';
import { ToastService } from '../../services/toast-notifications.service';
import { Word } from '../../core/models';
import { UserProfilesService } from '../../services/user-profiles.service';

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
  protected userProfilesService = inject(UserProfilesService);
  private toast = inject(ToastService);

  words = this.wordsService.words;
  hasMore = this.wordsService.hasMore;
  loadingMore = this.wordsService.loading;

  protected isModalOpen = signal(false);
  clicked = signal(-1);
  selectedWordFull = computed(() => this.words()[this.clicked()] ?? null);

  readonly searchTerm = signal('');

  private stuckSentinel = viewChild<ElementRef<HTMLElement>>('stuckSentinel');
  protected isStuck = signal(false);

  nDays = this.userProfilesService.streakDays;
  inStreak = this.userProfilesService.isStreakSecuredToday;
  nInteractions = this.userProfilesService.actionsCountedToday;
  protected readonly dailyThreshold = this.userProfilesService.daily_action_threshold;
  protected readonly progressPercent = computed(() =>
    Math.min(100, Math.round((this.nInteractions() * 100) / Math.max(1, this.dailyThreshold)))
  );
  protected readonly goalReached = computed(() => this.nInteractions() >= this.dailyThreshold);

  protected isEditWordModalOpen = signal(false);

  private readonly stuckObserver = effect((onCleanup) => {
    const el = this.stuckSentinel()?.nativeElement;
    if (!el) {
      this.isStuck.set(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        this.isStuck.set(!entry.isIntersecting && entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0));
      },
      { rootMargin: '-16px 0px 0px 0px', threshold: 0 } 
    );
    observer.observe(el);
    onCleanup(() => observer.disconnect());
  });

  constructor() {
    const user = this.userProfilesService.profile();
    if (!user) return;
    this.wordsService.load(user.id, 20).subscribe({
      error: (err) => {
        console.error(err);
        this.toast.error('Could not load the words. Please try again.');
      }
    });
  }

  loadMore(): void {
    const user = this.userProfilesService.profile();
    if (!user) return;
    this.wordsService.loadMore(user.id).subscribe({
      error: (err) => {
        console.error(err);
        this.toast.error('Could not load the words. Please try again.');
      }
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

  onToggleFavourite(word: Word): void {
    this.wordsService.update(word.id, { is_favourite: !word.is_favourite }).subscribe({
      error: (err) => {
        console.error(err);
        this.toast.error('Could not update favourite. Please try again.');
      }
    });
  }

  onSearchInput(value: string): void {
    this.searchTerm.set(value);
  }
}