import { AgeRange, GetLink, PrivacyItemsControlsData } from './main.model';

export const SOCIAL_PROFILE_LINKS_ROOT: { [key: string]: GetLink } = {
  linkedin: (userName: string) => (userName ? `https://www.linkedin.com/in/${userName}` : ''),
  instagram: (userName: string) => (userName ? `https://instagram.com/${userName}` : ''),
  telegram: (userName: string) => (userName ? `https:/t.me/${userName}` : ''),
  facebook: (userName: string) => (userName ? `https://www.facebook.com/${userName}` : ''),
  skype: (userName: string) => (userName ? `skype:${userName}?chat` : '')
};

export enum PRIORITY_ORDER {
  linkedin,
  instagram,
  telegram,
  facebook,
  skype
}

export const DISABLED_PRIVACY_ITEMS: PrivacyItemsControlsData = {
  age: false,
  location: false,
  description: false
};

export const AGE_RANGE: AgeRange = {
  minAge: 18,
  maxAge: 70
};

export enum FILTER_TYPE {
  Location = 'Location',
  Age = 'Age'
}

export enum FILTER_QUERY_TYPES {
  location = 'location',
  name = 'name'
}

export type FilterQueryConfig = { [key in FILTER_QUERY_TYPES]?: string } | { ageLimits: [number, number] };
