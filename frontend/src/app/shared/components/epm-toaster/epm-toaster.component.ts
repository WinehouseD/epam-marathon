import { Component, effect, HostBinding, Injector, OnInit, Signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ToasterMessage } from '../../../app.model';
import { TOASTER_ICONS } from '../../../app.config';
import { ToasterService } from '../../../services/toaster.service';

@Component({
  selector: 'epm-toaster',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  templateUrl: './epm-toaster.component.html',
  styleUrls: ['./epm-toaster.component.scss']
})
export class EpmToasterComponent implements OnInit {
  @HostBinding('class.hidden') isToasterHidden = true;

  toasterMessage!: Signal<ToasterMessage>;

  readonly closeIcon: string = TOASTER_ICONS.Close;

  constructor(
    private toasterService: ToasterService,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.toasterMessage = this.toasterService.toasterSettings;
    this.toasterService.setupNavigationEventListener();
    this.initializeToasterVisibility();
  }

  onCloseClick(): void {
    this.toasterService.closeToaster();
  }

  private initializeToasterVisibility(): void {
    effect(
      () => {
        this.isToasterHidden = this.toasterService.isHidden();
      },
      { injector: this.injector }
    );
  }
}
