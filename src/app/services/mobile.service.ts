import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';

const MOBILE_BREAKPOINT_PX = 768;

@Injectable({
  providedIn: 'root'
})
export class MobileService {
  private readonly destroyRef = inject(DestroyRef);

  private readonly _isMobile = signal(this.checkIfIsMobile());
  readonly isMobile = this._isMobile.asReadonly();

  constructor() {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`);
    const handler = (e: MediaQueryListEvent) => this._isMobile.set(e.matches);
    mql.addEventListener('change', handler);
    this.destroyRef.onDestroy(() => mql.removeEventListener('change', handler));
  }
  
  private checkIfIsMobile(): boolean {
    return typeof window !== 'undefined'
      ? window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`).matches
      : false;
  }

  getWindowWidth(): number {
    return typeof window !== 'undefined' ? window.innerWidth : 1024;
  }

  getWindowHeight(): number {
    return typeof window !== 'undefined' ? window.innerHeight : 800;
  }
}