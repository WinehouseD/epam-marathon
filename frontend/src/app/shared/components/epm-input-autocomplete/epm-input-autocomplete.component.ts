import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'epm-input-autocomplete',
  standalone: true,
  templateUrl: './epm-input-autocomplete.component.html',
  styleUrl: '../epm-input/epm-input.component.scss',
  imports: [CommonModule, FormsModule, MatAutocompleteModule, ReactiveFormsModule]
})
export class EpmInputAutocompleteComponent {
  @Input() control!: FormControl;
  @Input() labelPlaceholder = '';
  @Input() optionsList!: string[];
}
