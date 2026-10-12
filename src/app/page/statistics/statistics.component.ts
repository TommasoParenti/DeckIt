import { Component, computed, inject } from '@angular/core';
import { UserProfilesService } from '../../services/user-profiles.service';
import { CategoriesService } from '../../services/categories.service';
import { WordsService } from '../../services/words.service';
import { WipComponent } from '../../component/wip/wip.component';
import { WeekStreakComponent } from '../../component/week-streak/week-streak.component';
import { RelativeDatePipe } from '../../shared/relative-date.pipe';

function todayISODate(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
}

const MILESTONES = [3, 7, 14, 30, 60, 100, 365];
const RING_LENGTH = 2 * Math.PI * 45;

@Component({
  selector: 'app-statistics',
  imports: [WipComponent, WeekStreakComponent, RelativeDatePipe],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent {
  protected userProfilesService = inject(UserProfilesService);
  protected categoriesService = inject(CategoriesService);
  protected wordsService = inject(WordsService)

  readonly user = this.userProfilesService.profile;
  readonly streakDays = this.userProfilesService.streakDays;
  readonly actionsCountedToday = this.userProfilesService.actionsCountedToday;
  readonly daily_action_threshold = this.userProfilesService.daily_action_threshold;
  readonly lastActiveAt = this.userProfilesService.lastActiveAt;

  readonly isLastActiveToday = computed(() => this.lastActiveAt() === todayISODate());

  progressPercent = computed(() => Math.min(100, Math.round((this.actionsCountedToday() * 100) / this.userProfilesService.daily_action_threshold)));

  readonly nextMilestone = computed(() => MILESTONES.find(m => m > this.streakDays()) ?? null);
  readonly reachedMilestone = computed(() => [...MILESTONES].reverse().find(m => m <= this.streakDays()) ?? null);
  readonly ringOffset = computed(() => RING_LENGTH * (1 - this.progressPercent() / 100));
}
