import { Component, ElementRef, HostListener, Inject, OnInit, Renderer2, Signal, ViewChild } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormControl } from '@angular/forms';

import { EpmButtonComponent } from '../../../shared/components/epm-button/epm-button.component';
import { EpmSliderComponent } from '../epm-slider/epm-slider.component';
import { AgeRange, ExpandedUserDetailed } from '../../main.model';
import { AGE_RANGE, FILTER_QUERY_TYPES, FILTER_TYPE, FilterQueryConfig } from '../../main.config';
import { EpmSelectComponent } from '../../../shared/components/epm-select/epm-select.component';
import { CITY_LIST } from 'src/assets/data/city';
import { FilterService } from '../../services/filter.service';
import { MainApiService } from '../../services/main-api.service';

@Component({
  selector: 'epm-filter',
  standalone: true,
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
  imports: [CommonModule, EpmButtonComponent, EpmSliderComponent, EpmSelectComponent]
})
export class FilterComponent implements OnInit {
  @ViewChild('modal') modal!: ElementRef;

  @HostListener('click', ['$event']) handleMouseEvent(event: MouseEvent): void {
    if (event.target === this.modal.nativeElement) {
      this.closeModal();
    }
  }

  selectedMinAge = AGE_RANGE.minAge;
  selectedMaxAge = AGE_RANGE.maxAge;
  userList!: Signal<ExpandedUserDetailed[]>;
  cityList: string[] = CITY_LIST;
  EFilterType: typeof FILTER_TYPE = FILTER_TYPE;
  filterTypes = Object.keys(FILTER_TYPE) as string[];

  readonly filterTypeControl = new FormControl('');
  readonly cityControl = new FormControl('');

  get isApplyButtonDisabled(): boolean {
    return (
      !this.filterTypeControl.value ||
      (this.filterTypeControl.value === this.EFilterType.Location && !this.cityControl.value)
    );
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private filterService: FilterService,
    private mainApiService: MainApiService
  ) {}

  ngOnInit(): void {
    this.userList = this.mainApiService.userList;
  }

  openModal(): void {
    this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
    this.modal.nativeElement.showModal();
  }

  closeModal(): void {
    this.renderer.setStyle(this.document.body, 'overflow', 'auto');
    this.modal.nativeElement.close();
  }

  applyFilter(): void {
    this.filterService.setFilterSettings(this.prepareFilterSettings());
    this.filterService.applyFilter();
    this.filterService.setChipsList(this.prepareChipsName());
    this.closeModal();
  }

  onSliderInputChange(value: AgeRange): void {
    this.selectedMinAge = value.minAge;
    this.selectedMaxAge = value.maxAge;
  }

  private prepareFilterSettings(): FilterQueryConfig {
    return this.filterTypeControl.value === this.EFilterType.Location
      ? { [FILTER_QUERY_TYPES.location]: this.cityControl.value! }
      : { ageLimits: [this.selectedMinAge, this.selectedMaxAge] };
  }

  private prepareChipsName(): string[] {
    const chipsName =
      this.filterTypeControl.value === this.EFilterType.Location
        ? this.cityControl.value!
        : `${this.selectedMinAge}-${this.selectedMaxAge} years`;

    return [chipsName];
  }
}
