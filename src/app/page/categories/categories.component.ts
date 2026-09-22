import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CategoryCardComponent } from '../../component/category-card/category-card.component';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from '../../services/categories.service';
import { CategoryInsert } from '../../core/models';
import { AuthService } from '../../services/auth-service/auth.service';
import { MobileService } from '../../services/mobile.service';
import { Router } from '@angular/router';
import { ResponsiveModalComponent } from '../../component/responsive-modal/responsive-modal.component';
import { LoadingSpinnerComponent } from '../../component/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-categories',
  imports: [FormsModule, CategoryCardComponent, ResponsiveModalComponent, LoadingSpinnerComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent {
  protected categoriesService = inject(CategoriesService);
  private auth = inject(AuthService);
  private router = inject(Router);
  protected mobileService = inject(MobileService);

  categories = this.categoriesService.categories;

  isAddCategoryModalOpen = signal(false);

  readonly iconOptions: string[] = [
    'ti-cloud-rain', 'ti-sun', 'ti-book', 'ti-briefcase',
    'ti-heart-rate-monitor', 'ti-coffee', 'ti-plane', 'ti-home',
    'ti-device-gamepad-2', 'ti-music', 'ti-shopping-cart', 'ti-car',
    'ti-palette', 'ti-camera'
  ];
  newCategoryName = '';
  newCategoryDescription = '';
  newCategoryIcon = this.iconOptions[0];
  newCategoryColor = "#5B7FA6";

  private readonly hexColorPattern = /^#[0-9A-Fa-f]{6}$/;

  openAddCategoryModal(): void {
    this.resetForm();
    this.isAddCategoryModalOpen.set(true);
  }

  onCreate(): void {
    const user = this.auth.user();
    if (!user) return;
    const category: CategoryInsert = {color: this.newCategoryColor.slice(1), description: this.newCategoryDescription, icon: this.newCategoryIcon, name: this.newCategoryName, user_id: user.id};
    this.categoriesService.create(category).subscribe({
      next: () => this.isAddCategoryModalOpen.set(false),
      error: (err) => console.error('Error', err)
    });
  }

  isFormValid(): boolean {
    return (
      this.newCategoryName.trim().length > 0 &&
      this.newCategoryIcon.trim().length > 0 &&
      this.isValidColor()
    );
  }

  previewBackground(): string {
    return `color-mix(in srgb, ${this.newCategoryColor} 16%, white)`;
  }

  previewColor(): string {
    return `color-mix(in srgb, ${this.newCategoryColor} 75%, black)`;
  }

  private resetForm(): void {
    this.newCategoryName = '';
    this.newCategoryDescription = '';
    this.newCategoryIcon = this.iconOptions[0];
    this.newCategoryColor = "#5B7FA6";
  }

  openCategory(category: string) {
    this.router.navigate(["categories", category]);
  }

  isValidColor(): boolean {
    return this.hexColorPattern.test(this.newCategoryColor);
  }
}
