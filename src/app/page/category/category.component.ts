import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { Location } from '@angular/common';
import { WordsService } from '../../services/words.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { VocabularyCardComponent } from '../../component/vocabulary-card/vocabulary-card.component';
import { ResponsiveModalComponent } from '../../component/responsive-modal/responsive-modal.component';
import { CategoriesService } from '../../services/categories.service';
import { HoldButtonComponent } from '../../component/hold-button/hold-button.component';
import { FormsModule } from '@angular/forms';
import { MobileService } from '../../services/mobile.service';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../../component/loading-spinner/loading-spinner.component';
import { LoadMoreButtonComponent } from '../../component/load-more-button/load-more-button.component';
import { WordDetailModalComponent } from '../../component/word-detail-modal/word-detail-modal.component';
import { WordEditModalComponent } from '../../component/word-edit-modal/word-edit-modal.component';

@Component({
  selector: 'app-category',
  imports: [VocabularyCardComponent, ResponsiveModalComponent, HoldButtonComponent, FormsModule, LoadingSpinnerComponent, LoadMoreButtonComponent, WordDetailModalComponent, WordEditModalComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent {
  private location = inject(Location);
  protected wordsService = inject(WordsService);
  protected categoriesService = inject(CategoriesService);
  protected mobileService = inject(MobileService);
  private auth = inject(AuthService);
  private router = inject(Router);

  category = input.required<string>();
  currentCategory = computed(() =>
    this.categoriesService.categories().find(c => c.name === this.category())
  );

  words = this.wordsService.wordsByCategory;
  hasMore = this.wordsService.hasMoreByCategory;
  loadingMore = this.wordsService.loadingByCategory;

  isModalOpen = signal(false);
  clicked = signal(-1);
  selectedWordFull = computed(() => this.words()[this.clicked()] ?? null);

  isEditWordModalOpen = signal(false);

  isEditCategoryModalOpen = signal(false);
  editCategoryName = '';
  editCategoryIcon = '';
  editCategoryColor = '';
  editCategoryDescription = '';

  private readonly hexColorPattern = /^[0-9A-Fa-f]{6}$/;

  constructor() {
    effect(() => {
      const user = this.auth.user();
      if (!user) return;
      this.wordsService.loadByCategory(this.category(), user.id, 20).subscribe({
        error: (err) => console.error('Error:', err)
      });
    })
  }

  loadMore(): void {
    const user = this.auth.user();
    if (!user) return;
    this.wordsService.loadMoreByCategory(user.id).subscribe({
      error: (err) => console.error('Error:', err)
    });
  }

  deleteCategory(): void {
    const current = this.currentCategory();
    if (!current) return;
    const user = this.auth.user();
    if (!user) return;

    this.categoriesService.delete(user.id, current.name).subscribe({
      next: () => this.goBack(),
      error: (err) => console.error('Error:', err)
    });
  }

  editCategory(): void {
    const current = this.currentCategory();
    if (!current) return;
    this.editCategoryName = current.name;
    this.editCategoryDescription = current.description ?? '';
    this.editCategoryIcon = current.icon ? current.icon : "";
    this.editCategoryColor = current.color;
    this.isEditCategoryModalOpen.set(true);
  }

  isEditCategoryFormValid(): boolean {
    return (
      this.editCategoryName.trim().length > 0 &&
      this.editCategoryIcon.trim().length > 0 &&
      this.isValidCategoryColor()
    );
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

  onSaveEditCategory(): void {
    const current = this.currentCategory();
    if (!current) return;
    const user = this.auth.user();
    if (!user) return;

    const updated = {
      ...current,
      name: this.editCategoryName,
      description: this.editCategoryDescription,
      icon: this.editCategoryIcon,
      color: this.editCategoryColor,
    };

    this.categoriesService.update(user.id, current.name, updated).subscribe({
      next: () => {
        this.isEditCategoryModalOpen.set(false);
        this.router.navigate(['categories', updated.name], { replaceUrl: true });
      },
      error: (err) => console.error('Error:', err)
    });
  }

  goBack(): void {
    this.location.back();
  }

  isValidCategoryColor(): boolean {
    return this.hexColorPattern.test(this.editCategoryColor);
  }
}