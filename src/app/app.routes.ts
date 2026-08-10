import { Routes } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { VocabularyComponent } from './page/vocabulary/vocabulary.component';
import { CategoriesComponent } from './page/categories/categories.component';
import { FlashcardsComponent } from './page/flashcards/flashcards.component';
import { StatisticsComponent } from './page/statistics/statistics.component';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [noAuthGuard]},
  {
    path: '', component: MainLayoutComponent, canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'vocabulary' },
      { path: 'vocabulary', component: VocabularyComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'flashcards', component: FlashcardsComponent },
      { path: 'statistics', component: StatisticsComponent },
    ]
  },
  { path: '**', redirectTo: 'login' }
];