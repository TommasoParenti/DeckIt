import { Pipe, PipeTransform } from '@angular/core';

const MS_PER_DAY = 86_400_000;
const MAX_RELATIVE_DAYS = 7;

const RELATIVE = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
const SAME_YEAR = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const OTHER_YEAR = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

function toDayNumber(value: Date | string | number): number {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number);
    return Math.floor(Date.UTC(y, m - 1, d) / MS_PER_DAY);
  }
  const date = new Date(value);
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY);
}

@Pipe({ name: 'relativeDate' })
export class RelativeDatePipe implements PipeTransform {
  transform(value: Date | string | number | null | undefined): string {
    if (value == null) return '';

    const target = toDayNumber(value);
    if (Number.isNaN(target)) return '';

    const diff = toDayNumber(new Date()) - target;

    if (diff >= 0 && diff <= MAX_RELATIVE_DAYS) {
      return RELATIVE.format(-diff, 'day');
    }

    const date = new Date(target * MS_PER_DAY);
    const sameYear = date.getUTCFullYear() === new Date().getFullYear();
    return (sameYear ? SAME_YEAR : OTHER_YEAR).format(date); 
  }
}