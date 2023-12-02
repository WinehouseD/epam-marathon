import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { APP_ROUTER_NAME } from '../../../app.config';

@Component({
  selector: 'epm-auth-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './auth-success.component.html',
  styleUrl: './auth-success.component.scss'
})
export class AuthSuccessComponent {
  readonly linkToCatalog: string = `/${APP_ROUTER_NAME.Main}/${APP_ROUTER_NAME.Contact}`;
  readonly linkToProfile: string = `/${APP_ROUTER_NAME.Main}/${APP_ROUTER_NAME.ProfileSettings}/${APP_ROUTER_NAME.Info}`;
}
