import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';

import { AgeRange } from '../../main.model';
import { AGE_RANGE } from '../../main.config';

@Component({
  selector: 'epm-slider',
  standalone: true,
  imports: [CommonModule, MatSliderModule, FormsModule],
  templateUrl: './epm-slider.component.html',
  styleUrl: './epm-slider.component.scss'
})
export class EpmSliderComponent {
  @Input() selectedMin!: number;
  @Input() selectedMax!: number;

  @Output() valueChanged: EventEmitter<AgeRange> = new EventEmitter<AgeRange>();

  readonly ageRange: typeof AGE_RANGE = AGE_RANGE;

  onInputChange(): void {
    this.normalizeSelectedValues();
    const selectedValues: AgeRange = {
      minAge: this.selectedMin,
      maxAge: this.selectedMax
    };
    this.valueChanged.emit(selectedValues);
  }

  private normalizeSelectedValues(): void {
    if (this.selectedMin > this.selectedMax) {
      this.selectedMin = this.selectedMax;
    }
    if (this.selectedMin < AGE_RANGE.minAge || this.selectedMin === null) {
      this.selectedMin = AGE_RANGE.minAge;
    }
    if (this.selectedMax < AGE_RANGE.minAge || this.selectedMax === null) {
      this.selectedMax = AGE_RANGE.minAge;
    }
    if (this.selectedMin > AGE_RANGE.maxAge) {
      this.selectedMin = AGE_RANGE.maxAge;
    }
    if (this.selectedMax > AGE_RANGE.maxAge) {
      this.selectedMax = AGE_RANGE.maxAge;
    }
  }
}
