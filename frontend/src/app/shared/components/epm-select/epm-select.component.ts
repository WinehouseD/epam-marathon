import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { EpmButtonComponent } from '../epm-button/epm-button.component';

interface SearchEvent {
  items: unknown[];
  term: string;
}

@Component({
  selector: 'epm-select',
  templateUrl: './epm-select.component.html',
  styleUrls: ['./epm-select.component.scss'],
  standalone: true,
  imports: [NgSelectModule, CommonModule, ReactiveFormsModule, EpmButtonComponent]
})
export class EpmSelectComponent implements OnInit {
  @ViewChild('selectRef') selectRef!: NgSelectComponent;

  @Input() dropdownList!: string[];
  @Input() control!: FormControl;
  @Input() closeOnSelect!: boolean;
  @Input() title = '';
  @Input() placeholder = '';
  @Input() customClassName = '';
  @Input() multiple = false;
  @Input() editableSearchTerm = false;
  @Input() virtualScroll = true;
  @Input() searchable = false;
  @Input() required = false;
  @Input() clearable = false;
  @Input() disabled = false;

  @Output() changeSelect: EventEmitter<string> = new EventEmitter<string>();

  filteredDropdownList!: string[];

  ngOnInit() {
    this.refreshList();
  }

  onOpen(): void {
    this.refreshList();
  }

  onSearchSelect({ term }: SearchEvent): void {
    term = term.toLowerCase();
    this.filteredDropdownList = this.dropdownList.filter((item: string) => {
      return item.toString().toLowerCase().includes(term);
    });
  }

  onChange(value: string): void {
    this.changeSelect.emit(value);
  }

  private refreshList(): void {
    this.filteredDropdownList = this.dropdownList;
  }
}
