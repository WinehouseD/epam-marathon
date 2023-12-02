import { Injectable, Signal, WritableSignal, signal } from '@angular/core';

import { MainApiService } from './main-api.service';
import { FilterQueryConfig } from '../main.config';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  filterSettings!: FilterQueryConfig;
  filterChipsList$: WritableSignal<string[]> = signal([]);
  filterChipsList: Signal<string[]> = this.filterChipsList$.asReadonly();

  constructor(private mainApiService: MainApiService) {}

  setFilterSettings(settings: FilterQueryConfig): void {
    this.filterSettings = settings;
  }

  setChipsList(chips: string[]): void {
    this.filterChipsList$.set(chips);
  }

  applyFilter(): void {
    this.mainApiService.clearUserList();
    this.getFilteredUsers();
  }

  getFilteredUsers(): void {
    this.mainApiService.getFilteredUsers(this.filterSettings).pipe(take(1)).subscribe();
  }
}
