import { Routes } from '@angular/router';

import { APP_ROUTER_NAME, HEADER_CONFIG_LIST, HEADER_CONFIG_NAME } from '../../app.config';
import { MainComponent } from './main.component';
import { ContactListComponent } from '../pages/contact-list/contact-list.component';
import { ChatListComponent } from '../pages/chat-list/chat-list.component';
import { ChatComponent } from '../components/chat/chat.component';
import UserComponent from '../pages/user/user.component';
import { canActivateAuthGuard } from '../../services/guards/can-activate-auth.guard';
import { userPersonalDataResolver } from '../../services/guards/user-personal-data.resolver';
import { userCardResolver } from '../../services/guards/user-card.resolver';

export default [
  {
    path: '',
    component: MainComponent,
    resolve: {
      userData: userPersonalDataResolver
    },
    data: HEADER_CONFIG_LIST[HEADER_CONFIG_NAME.mainRoot],
    children: [
      {
        path: '',
        redirectTo: APP_ROUTER_NAME.Contact,
        pathMatch: 'full',
        data: HEADER_CONFIG_LIST[HEADER_CONFIG_NAME.mainRoot]
      },
      {
        path: APP_ROUTER_NAME.Contact,
        component: ContactListComponent,
        data: HEADER_CONFIG_LIST[HEADER_CONFIG_NAME.mainRoot],
        title: 'U-PAMERS'
      },
      {
        path: `${APP_ROUTER_NAME.Contact}/:userId`,
        component: UserComponent,
        canActivate: [canActivateAuthGuard],
        resolve: {
          userCard: userCardResolver
        },
        data: HEADER_CONFIG_LIST[HEADER_CONFIG_NAME.contacts]
      },
      {
        path: APP_ROUTER_NAME.Chat,
        component: ChatListComponent,
        canActivate: [canActivateAuthGuard],
        title: 'U-PAMERS | Chat',
        data: HEADER_CONFIG_LIST[HEADER_CONFIG_NAME.messages]
      },
      {
        path: `${APP_ROUTER_NAME.Chat}/:userId`,
        component: ChatComponent,
        canActivate: [canActivateAuthGuard],
        data: HEADER_CONFIG_LIST[HEADER_CONFIG_NAME.chat]
      },
      {
        path: APP_ROUTER_NAME.MyProfile,
        canActivate: [canActivateAuthGuard],
        loadComponent: () => import('../pages/profile/profile.component'),
        title: 'U-PAMERS | My Profile',
        data: HEADER_CONFIG_LIST[HEADER_CONFIG_NAME.myProfile]
      },
      {
        path: APP_ROUTER_NAME.AvatarEdit,
        loadComponent: () => import('../../shared/components/avatar-edit/avatar-edit.component'),
        data: HEADER_CONFIG_LIST[HEADER_CONFIG_NAME.avatarEdit]
      },
      {
        path: APP_ROUTER_NAME.ProfileSettings,
        canActivateChild: [canActivateAuthGuard],
        loadChildren: () => import('../pages/profile-settings/profile-settings.routes'),
        title: 'U-PAMERS | Profile Settings',
        data: HEADER_CONFIG_LIST[HEADER_CONFIG_NAME.profileSettings]
      }
    ]
  }
] as Routes;
