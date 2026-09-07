import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  removing: boolean;
}

const EXIT_ANIMATION_MS = 200;

@Injectable({ 
  providedIn: 'root' 
})
export class ToastService {
  private readonly _toasts = signal<ToastItem[]>([]);
  readonly toasts = this._toasts.asReadonly();

  private timers = new Map<string, ReturnType<typeof setTimeout>>();

  success(message: string, duration = 4000): string {
    return this.push(message, 'success', duration);
  }

  error(message: string, duration = 6000): string {
    return this.push(message, 'error', duration);
  }

  warning(message: string, duration = 5000): string {
    return this.push(message, 'warning', duration);
  }

  info(message: string, duration = 4000): string {
    return this.push(message, 'info', duration);
  }

  private push(message: string, type: ToastType, duration: number): string {
    const id = crypto.randomUUID();
    this._toasts.update(list => [...list, { id, message, type, removing: false }]);

    if (duration > 0) {
      this.timers.set(id, setTimeout(() => this.dismiss(id), duration));
    }
    return id;
  }

  dismiss(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }

    this._toasts.update(list => list.map(t => (t.id === id ? { ...t, removing: true } : t)));

    setTimeout(() => {
      this._toasts.update(list => list.filter(t => t.id !== id));
    }, EXIT_ANIMATION_MS);
  }

  clear(): void {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    this._toasts.set([]);
  }
}