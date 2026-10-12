import { Component, computed, inject, input } from '@angular/core';
import { MobileService } from '../../services/mobile.service';

interface WeekDay {
  key: number;
  short: string;
  full: string;
  date: number;
  month: string;
  active: boolean;
  today: boolean;
}

const MS_PER_DAY = 86_400_000;
const MONTH_FORMAT = new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' });
const DAYS = [
  { short: 'Mon', full: 'Monday' },
  { short: 'Tue', full: 'Tuesday' },
  { short: 'Wed', full: 'Wednesday' },
  { short: 'Thu', full: 'Thursday' },
  { short: 'Fri', full: 'Friday' },
  { short: 'Sat', full: 'Saturday' },
  { short: 'Sun', full: 'Sunday' },
];
 
function dayNumber(d: Date): number {
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / MS_PER_DAY);
}

@Component({
  selector: 'app-week-streak',
  imports: [],
  templateUrl: './week-streak.component.html',
  styleUrl: './week-streak.component.scss'
})
export class WeekStreakComponent {
  protected mobileService = inject(MobileService);

  readonly lastActiveDate = input<Date | string | number | null | undefined>(null);
  readonly streakDays = input<number>(0);
 
  readonly days = computed<WeekDay[]>(() => {
    const today = new Date();
    const todayNum = dayNumber(today);

    const todayIndex = (today.getDay() + 6) % 7;
    const mondayNum = todayNum - todayIndex;

    const last = this.lastActiveDate();
    const lastActiveNum = last == null ? null : dayNumber(new Date(last));
    const streak = Math.max(0, Math.floor(this.streakDays()));

    return DAYS.map((d, i) => {
      const num = mondayNum + i;
      const date = new Date(num * MS_PER_DAY);
      const daysFromLastActive = lastActiveNum === null ? -1 : lastActiveNum - num;
      return {
        key: num,
        short: d.short,
        full: d.full,
        date: date.getUTCDate(),
        month: MONTH_FORMAT.format(date),
        today: num === todayNum,
        active: daysFromLastActive >= 0 && daysFromLastActive < streak,
      };
    });
  });
}
