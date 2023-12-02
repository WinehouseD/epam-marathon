import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, startWith, tap } from 'rxjs';

import { INITIAL_TOASTER_CONFIG, TOASTER_MESSAGES } from '../shared/components/epm-toaster/toaster.config';
import { ToasterMessage } from '../app.model';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { APP_ROUTER_NAME } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  private isHidden$: WritableSignal<boolean> = signal(true);
  private toasterSettings$: WritableSignal<ToasterMessage> = signal(INITIAL_TOASTER_CONFIG);

  readonly isHidden: Signal<boolean> = this.isHidden$.asReadonly();
  readonly toasterSettings: Signal<ToasterMessage> = this.toasterSettings$.asReadonly();
  readonly routerNames: typeof APP_ROUTER_NAME = APP_ROUTER_NAME;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  openToaster(): void {
    this.isHidden$.set(false);
  }

  closeToaster(): void {
    this.isHidden$.set(true);
  }

  setupNavigationEventListener(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        startWith(this.router),
        tap(() => {
          this.toasterSettings$.set(this.getToasterSettings());
          this.manageContactPageToaster();
        })
      )
      .subscribe();
  }

  resetToasterSettings(): void {
    this.toasterSettings$.set(TOASTER_MESSAGES.notLoggedIn);
    this.openToaster();
  }

  private manageContactPageToaster(): void {
    if (this.shouldDisplayContactPageToaster() && this.toasterSettings() !== INITIAL_TOASTER_CONFIG) {
      this.openToaster();
    } else {
      this.closeToaster();
    }
  }

  private getToasterSettings(): ToasterMessage {
    if (!this.authService.isUserLoggedIn()) {
      return TOASTER_MESSAGES.notLoggedIn;
    }
    if (this.shouldDisplayProfileToaster()) {
      return TOASTER_MESSAGES.notFilledProfile;
    }
    return INITIAL_TOASTER_CONFIG;
  }

  private shouldDisplayContactPageToaster(): boolean {
    return this.router.url === `/${this.routerNames.Main}/${this.routerNames.Contact}`;
  }

  private shouldDisplayProfileToaster(): boolean {
    return !this.apiService.currentUser()?.about && !!this.apiService.currentUser()?.interests.length;
  }
}
