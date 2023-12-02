import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { APP_ROUTER_NAME } from '../../../app.config';

@Component({
  selector: 'epm-header-context-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './epm-header-context-menu.component.html',
  styleUrl: './epm-header-context-menu.component.scss'
})
export class EpmHeaderContextMenuComponent {
  @Output() logout: EventEmitter<void> = new EventEmitter<void>();

  readonly myProfileLink: string = `/${APP_ROUTER_NAME.Main}/${APP_ROUTER_NAME.MyProfile}`;
  readonly mainCatalogLink: string = `/${APP_ROUTER_NAME.Main}/${APP_ROUTER_NAME.Contact}`;
  readonly settingsLink: string = `/${APP_ROUTER_NAME.Main}/${APP_ROUTER_NAME.ProfileSettings}`;

  onLogoutClick(): void {
    this.logout.emit();
  }
}
