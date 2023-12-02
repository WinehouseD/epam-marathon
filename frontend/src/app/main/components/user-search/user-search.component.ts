import { Component, DestroyRef, HostBinding, HostListener, OnInit, Signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, startWith, take, tap } from 'rxjs';

import { APP_ROUTER_NAME, BUTTON_THEMES, ICON_NAMES, INPUT_TYPES } from '../../../app.config';
import { EpmButtonComponent } from '../../../shared/components/epm-button/epm-button.component';
import { EpmChipsComponent } from '../../../shared/components/epm-chips/epm-chips.component';
import { FilterComponent } from '../filter/filter.component';
import { FilterService } from '../../services/filter.service';
import { MainApiService } from '../../services/main-api.service';
import { EpmInputComponent } from '../../../shared/components/epm-input/epm-input.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'epm-user-search',
  standalone: true,
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss'],
  imports: [
    CommonModule,
    EpmButtonComponent,
    EpmChipsComponent,
    FilterComponent,
    EpmInputComponent,
    ReactiveFormsModule
  ]
})
export class UserSearchComponent implements OnInit {
  chipsList!: Signal<string[]>;
  isScrolled = false;
  inputType: typeof INPUT_TYPES = INPUT_TYPES;
  iconName: typeof ICON_NAMES = ICON_NAMES;

  readonly searchByNameControl = new FormControl('', { nonNullable: true });
  readonly routerNames: typeof APP_ROUTER_NAME = APP_ROUTER_NAME;
  readonly buttonThemes: typeof BUTTON_THEMES = BUTTON_THEMES;
  readonly iconNames: typeof ICON_NAMES = ICON_NAMES;

  @HostBinding('class.hidden') isSearchHidden = true;

  @HostListener('window:scroll') onScroll(): void {
    this.isScrolled = window.scrollY > 0;
  }

  @ViewChild(FilterComponent) filter!: FilterComponent;

  constructor(
    private router: Router,
    private filterService: FilterService,
    private mainApiService: MainApiService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.setupSearchPanelVisibility();
    this.initSubscription();
    this.chipsList = this.filterService.filterChipsList;
  }

  editChipsStatus(chips: string): void {
    const filteredList = this.chipsList().filter(item => item !== chips);
    this.filterService.setChipsList(filteredList);
    if (!this.chipsList().length) {
      this.mainApiService.clearUserList();
      this.mainApiService.getUserList().pipe(take(1)).subscribe();
    }
  }

  openFiltersModal(): void {
    this.filter.openModal();
  }

  clearSearch(): void {
    this.editChipsStatus(this.searchByNameControl.value);
    this.searchByNameControl.reset();
  }

  private setupSearchPanelVisibility(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        startWith(this.router),
        tap(() => {
          this.isSearchHidden = this.router.url !== `/${this.routerNames.Main}/${this.routerNames.Contact}`;
        })
      )
      .subscribe();
  }

  private initSubscription(): void {
    this.searchByNameControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter(value => !!value && value?.length > 1),
        takeUntilDestroyed(this.destroyRef),
        tap(prompt => this.searchByName(prompt))
      )
      .subscribe();
  }

  private searchByName(prompt: string): void {
    this.filterService.setFilterSettings({ name: prompt });
    this.filterService.applyFilter();
    this.filterService.setChipsList([prompt]);
  }
}
