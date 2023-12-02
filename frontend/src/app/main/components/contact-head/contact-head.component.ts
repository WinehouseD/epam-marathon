import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';

import { SvgIconComponent } from '../../../shared/components/svg-icon/svg-icon.component';
import { APP_ROUTER_NAME, BUTTON_THEMES, ICON_NAMES, SOCIAL_ICONS } from '../../../app.config';
import { DetailedSocialLink, ExpandedUserDetailed } from '../../main.model';
import { EpmButtonComponent } from '../../../shared/components/epm-button/epm-button.component';
import { SetUserAvatarPipe } from '../../../shared/pipes/set-user-avatar.pipe';
import { AvatarService } from '../../../services/avatar.service';

@Component({
  selector: 'epm-contact-head',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, SvgIconComponent, EpmButtonComponent, SetUserAvatarPipe],
  templateUrl: './contact-head.component.html',
  styleUrls: ['./contact-head.component.scss']
})
export class ContactHeadComponent implements OnInit {
  @Input({ required: true }) user!: ExpandedUserDetailed;
  @Input() editableAvatar?: boolean = false;

  readonly iconNames: typeof ICON_NAMES = ICON_NAMES;
  readonly buttonThemes: typeof BUTTON_THEMES = BUTTON_THEMES;
  readonly appRoutes: typeof APP_ROUTER_NAME = APP_ROUTER_NAME;

  constructor(
    private avatarService: AvatarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.avatarService.setUserAvatarDraft(this.user.avatar);
  }

  trackByPriority(_index: number, social: DetailedSocialLink): number {
    return social.priority;
  }

  onSocialClick(event: MouseEvent, link: string, type: SOCIAL_ICONS): void {
    event.stopPropagation();
    const target = type === SOCIAL_ICONS.Skype ? '_self' : '_blank';
    window.open(link, target);
  }

  onAvatarEdit(): void {
    fetch(this.user.avatar)
      .then(res => res.blob())
      .then(blob => {
        const fileEvent = this.blobToFileEvent(blob);
        this.avatarService.setImageChangeEvent(fileEvent);
        this.router.navigateByUrl(`/${this.appRoutes.Main}/${this.appRoutes.AvatarEdit}`);
      });
  }

  private blobToFileEvent(blob: Blob): Event {
    const file = new File([blob], 'avatar.png', { type: 'image/png' });

    return {
      target: { files: [file] }
    } as unknown as Event;
  }
}
