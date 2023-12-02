import { Component, ElementRef, HostListener, OnInit, Signal, signal, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { EpmButtonComponent } from '../epm-button/epm-button.component';
import { APP_ROUTER_NAME, BUTTON_THEMES, HEADER_RIGHT_BLOCK } from '../../../app.config';
import { HeaderConfig } from '../../../app.model';
import { HeaderService } from '../../../services/header.service';
import { EpmNavigationIconComponent } from '../epm-navigation-icon/epm-navigation-icon.component';
import { SetUserAvatarPipe } from '../../pipes/set-user-avatar.pipe';
import { EpmHeaderContextMenuComponent } from '../epm-header-context-menu/epm-header-context-menu.component';
import { UserDetailed } from '../../../main/main.model';
import { ApiService } from '../../../services/api.service';
import { CognitoService } from '../../../services/cognito.service';
import { ToasterService } from '../../../services/toaster.service';

@Component({
  selector: 'epm-header',
  standalone: true,
  imports: [
    CommonModule,
    EpmButtonComponent,
    NgOptimizedImage,
    RouterLink,
    EpmNavigationIconComponent,
    SetUserAvatarPipe,
    EpmHeaderContextMenuComponent,
    RouterLinkActive
  ],
  templateUrl: './epm-header.component.html',
  styleUrls: ['./epm-header.component.scss']
})
export class EpmHeaderComponent implements OnInit {
  @ViewChild('settings') settings!: ElementRef;

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    if (!this.isClickOnSettingsButton(event)) {
      this.isContextMenuOpen = false;
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.shouldAddShadow = !this.headerSettings().colored && window.scrollY > 0;
  }

  currentUser!: Signal<UserDetailed | null>;
  shouldAddShadow = false;
  isContextMenuOpen = false;
  newMessage: Signal<boolean> = signal(true);
  headerSettings: Signal<HeaderConfig> = this.headerService.headerSettings;

  readonly chatLink: string = `/${APP_ROUTER_NAME.Main}/${APP_ROUTER_NAME.Chat}`;
  readonly loginLink: string = `/${APP_ROUTER_NAME.Auth}/${APP_ROUTER_NAME.LogIn}`;
  readonly buttonThemes: typeof BUTTON_THEMES = BUTTON_THEMES;
  readonly headerRightBlock: typeof HEADER_RIGHT_BLOCK = HEADER_RIGHT_BLOCK;

  constructor(
    private headerService: HeaderService,
    private apiService: ApiService,
    private cognitoService: CognitoService,
    private toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this.headerService.initSubscription();
    this.currentUser = this.apiService.currentUser;
  }

  back(): void {
    this.headerService.back();
  }

  navigateToMain(): void {
    this.headerService.back();
  }

  onSettingsClick(): void {
    this.isContextMenuOpen = !this.isContextMenuOpen;
  }

  onLogoutClick(): void {
    this.cognitoService.logout();
    this.apiService.clearUserData();
    this.toasterService.resetToasterSettings();
  }

  private isClickOnSettingsButton(event: MouseEvent): boolean {
    const targetElement: HTMLElement = event.target as HTMLElement;

    return targetElement.classList.contains('avatar-wrapper') || targetElement.classList.contains('avatar');
  }
}
