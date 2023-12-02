import { Injectable, Signal, WritableSignal, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private isLoading$: WritableSignal<boolean> = signal(false);
  readonly isLoading: Signal<boolean> = computed(this.isLoading$);

  showLoader(): void {
    this.isLoading$.set(true);
  }

  hideLoader(): void {
    this.isLoading$.set(false);
  }
}
