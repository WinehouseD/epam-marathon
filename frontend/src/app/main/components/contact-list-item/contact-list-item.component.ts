import { Component, Input, OnInit, signal, Signal, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';

import { DetailedSocialLink, ExpandedUserDetailed, UserDetailed } from '../../main.model';
import { EpmButtonComponent } from '../../../shared/components/epm-button/epm-button.component';
import { APP_ROUTER_NAME, BUTTON_THEMES, ICON_NAMES, MODAL_LOGIN, SOCIAL_ICONS } from '../../../app.config';
import { SvgIconComponent } from '../../../shared/components/svg-icon/svg-icon.component';
import { AgePipe } from '../../../shared/pipes/age.pipe';
import { SetUserAvatarPipe } from '../../../shared/pipes/set-user-avatar.pipe';
import { EpmModalComponent } from '../../../shared/components/epm-modal/epm-modal.component';
import { AuthService } from '../../../services/auth.service';
import { ModalConfig } from '../../../app.model';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'epm-contact-list-item',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    EpmButtonComponent,
    SvgIconComponent,
    AgePipe,
    SetUserAvatarPipe,
    EpmModalComponent
  ],
  templateUrl: './contact-list-item.component.html',
  styleUrls: ['./contact-list-item.component.scss']
})
export class ContactListItemComponent implements OnInit {
  @Input() user!: ExpandedUserDetailed;

  @ViewChild('modal') modal!: EpmModalComponent;

  isLoggedIn!: Signal<UserDetailed | null>;
  isBirthdayVisible!: boolean;

  readonly buttonThemes: typeof BUTTON_THEMES = BUTTON_THEMES;
  readonly iconNames: typeof ICON_NAMES = ICON_NAMES;
  readonly modalConfig: ModalConfig = MODAL_LOGIN;

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.apiService.currentUser;
    this.isBirthdayVisible = !(this.user.privacy.account || this.user.privacy.age) && !!this.user.birthday;
  }

  onChatClick(event: MouseEvent): void {
    event.stopPropagation();
    const normalizedUserName = this.user.name.replaceAll(' ', '_');
    this.authService.isUserLoggedIn()
      ? this.router.navigateByUrl(`${APP_ROUTER_NAME.Main}/${APP_ROUTER_NAME.Chat}/${normalizedUserName}`, {
          state: { receiver: this.user }
        })
      : this.modal.openModal();
  }

  onSocialClick(event: MouseEvent, link: string, type: SOCIAL_ICONS): void {
    event.stopPropagation();
    const target = type === SOCIAL_ICONS.Skype ? '_self' : '_blank';
    window.open(link, target);
  }

  trackByPriority(_index: number, social: DetailedSocialLink): number {
    return social.priority;
  }

  onPrimaryButtonClick(): void {
    this.router.navigateByUrl(`${APP_ROUTER_NAME.Auth}/${APP_ROUTER_NAME.LogIn}`);
  }
}
