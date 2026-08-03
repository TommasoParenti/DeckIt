import { Routes } from '@angular/router';
import { VocabularyComponent } from './page/vocabulary/vocabulary.component';
import { CategoriesComponent } from './page/categories/categories.component';
import { FlashcardsComponent } from './page/flashcards/flashcards.component';
import { StatisticsComponent } from './page/statistics/statistics.component';

// 2. Colleghiamo le rotte ai componenti finti
export const routes: Routes = [
  { path: '', redirectTo: 'vocabulary', pathMatch: 'full' },
  { path: 'vocabulary', component: VocabularyComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'flashcards', component: FlashcardsComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: '**', redirectTo: 'vocabulary' }
];