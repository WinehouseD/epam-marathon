import { Component, Input, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from './loader.service';

@Component({
  selector: 'epm-loader',
  standalone: true,
  imports: [CommonModule],
  template: `<div [ngClass]="{ show: isLoading() || isTexting }" class="dot-flashing"></div>`,
  styleUrl: './epm-loader.component.scss'
})
export class EpmLoaderComponent implements OnInit {
  isLoading!: Signal<boolean>;
  //TODO add logic depends on websocket
  @Input() isTexting!: boolean;

  constructor(private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.isLoading = this.loaderService.isLoading;
  }
}
