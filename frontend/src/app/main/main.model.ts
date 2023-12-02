import { FormControl, FormGroup } from '@angular/forms';
import { RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { SOCIAL_ICONS } from '../app.config';

export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface ChatLastMessage extends User {
  lastMessage: string;
  lastMessageDateTime: string;
}

export interface UserDetailed extends User {
  birthday: number | null;
  registration: number;
  about: string;
  interests: string[];
  location: string;
  socialMedia: SocialLink;
  privacy: UserPrivacy;
}

export interface SocialLink {
  instagram: string;
  linkedin: string;
  facebook: string;
  skype: string;
  telegram: string;
}

export interface UserPrivacy {
  description: boolean;
  location: boolean;
  account: boolean;
  age: boolean;
}

export interface DetailedSocialLink {
  priority: number;
  link: string;
  type: SOCIAL_ICONS;
}

export interface ExpandedUserDetailed extends Omit<UserDetailed, 'socialMedia'> {
  socialMedia: DetailedSocialLink[];
}

export type GetLink = (userName: string) => string;

export interface ChatForm {
  message: FormControl<string>;
}

export interface Message {
  id: string;
  chatId: string;
  sender: string;
  time: string;
  text: string;
  read: boolean;
}

type SimpleFormType<T, U> = {
  [key in keyof T]: FormControl<U>;
};

export interface AccountDetailsData {
  email: string;
  name: string;
}

export type AccountDetailsForm = SimpleFormType<AccountDetailsData, string>;

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export type ChangePasswordForm = SimpleFormType<ChangePasswordData, string>;

export interface SocialMedias {
  linkedin: FormControl<string>;
  instagram: FormControl<string>;
  telegram: FormControl<string>;
  facebook: FormControl<string>;
  skype: FormControl<string>;
}

export interface RegisterForm {
  email: FormControl<string>;
  givenName: FormControl<string>;
  familyName: FormControl<string>;
  password: FormControl<string>;
  repeatPassword: FormControl<string>;
  avatar: FormControl<string>;
  socialMedia: FormGroup<SocialMedias>;
}

export interface PrivacyItemsControlsData {
  age: boolean;
  location: boolean;
  description: boolean;
}

export interface PrivacyItemsControls {
  age: FormControl<boolean>;
  location: FormControl<boolean>;
  description: FormControl<boolean>;
}

export interface PrivacyStatusForm {
  account: FormControl<boolean>;
  privacyItems: FormGroup<PrivacyItemsControls>;
}

export interface ProfileDetailsForm {
  birthday: FormControl<string>;
  location: FormControl<string>;
  about: FormControl<string>;
  socialMedia: FormGroup<SocialMedias>;
}

export interface AgeRange {
  minAge: number;
  maxAge: number;
}

export interface CanComponentDeactivate {
  canDeactivate?: (nextState: RouterStateSnapshot) => Observable<boolean> | Promise<boolean> | boolean;
}

export type CanDeactivateType = Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
