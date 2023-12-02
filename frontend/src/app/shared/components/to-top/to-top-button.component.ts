import { Component, HostListener } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';

import { BUTTON_THEMES, ICON_NAMES } from '../../../app.config';
import { EpmButtonComponent } from '../epm-button/epm-button.component';

@Component({
  selector: 'epm-to-top-button',
  standalone: true,
  templateUrl: './to-top-button.component.html',
  styleUrls: ['./to-top-button.component.scss'],
  imports: [CommonModule, EpmButtonComponent]
})
export class EpmToTopButtonComponent {
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollButton = window.scrollY > this.scrollHeightToShowButton;
  }

  showScrollButton!: boolean;

  readonly buttonThemes: typeof BUTTON_THEMES = BUTTON_THEMES;
  readonly iconNames: typeof ICON_NAMES = ICON_NAMES;

  private readonly scrollHeightToShowButton = 300;

  constructor(private viewport: ViewportScroller) {}

  scrollToTop(): void {
    this.viewport.scrollToPosition([0, 0]);
  }
}
