import { computed, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { EMPTY, map, Observable, pipe, switchMap, take, tap, UnaryFunction } from 'rxjs';
import { Router } from '@angular/router';

import { DetailedSocialLink, ExpandedUserDetailed, SocialLink, UserDetailed } from '../main.model';
import { SOCIAL_ICONS, APP_ROUTER_NAME } from '../../app.config';
import { FilterQueryConfig, PRIORITY_ORDER, SOCIAL_PROFILE_LINKS_ROOT } from '../main.config';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { convertUserNameToEmail } from '../../shared/utils/convertUserNameToEmail';

@Injectable({
  providedIn: 'root'
})
export class MainApiService {
  private userList$: WritableSignal<ExpandedUserDetailed[]> = signal([]);
  userList: Signal<ExpandedUserDetailed[]> = computed(this.userList$);

  private previousLastUserEmail = '';
  private currentLastUserEmail = '';

  private readonly limit = 10;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService
  ) {}

  clearUserList(): void {
    this.userList$.set([]);
    this.currentLastUserEmail = '';
  }

  getUserList(): Observable<ExpandedUserDetailed[]> {
    if (!this.isAllUsersInListLoaded()) {
      this.previousLastUserEmail = this.currentLastUserEmail;
      const hashKey = this.currentLastUserEmail ?? '';

      return this.apiService.getUserList(this.limit, hashKey).pipe(this.handleReceivedData());
    } else return EMPTY;
  }

  getFilteredUsers(settings: FilterQueryConfig): Observable<ExpandedUserDetailed[]> {
    if (!this.isAllUsersInListLoaded()) {
      this.previousLastUserEmail = this.currentLastUserEmail;
      const rangeKey = this.currentLastUserEmail ?? '';

      return this.apiService.getFilteredUserList(settings, this.limit, rangeKey).pipe(this.handleReceivedData());
    } else return EMPTY;
  }

  getExpandedPersonalData(): ExpandedUserDetailed {
    const user = this.apiService.currentUser();
    if (!user) {
      this.router.navigateByUrl(`/${APP_ROUTER_NAME.Main}`);
      return {} as ExpandedUserDetailed;
    }

    return { ...user, socialMedia: this.expandUserSocialMedia(user.socialMedia) };
  }

  updateUser(newDetails: Partial<UserDetailed>): Observable<UserDetailed> {
    const userId = convertUserNameToEmail(this.authService.getUserNameFromStorage());
    return this.apiService.updateUser(userId, newDetails).pipe(
      switchMap(() => this.apiService.getCurrentUser(userId)),
      take(1)
    );
  }

  expandUserSocialMedia(socialMedia: SocialLink): DetailedSocialLink[] {
    return Object.entries(socialMedia)
      .map(this.getDetailedSocials)
      .sort((a, b) => a.priority - b.priority);
  }

  private handleReceivedData(): UnaryFunction<Observable<UserDetailed[]>, Observable<ExpandedUserDetailed[]>> {
    return pipe(
      tap((newUserList: UserDetailed[]) => this.setLastUserEmail(newUserList)),
      map((newUserList: UserDetailed[]) => this.filterCurrentUser(newUserList)),
      map((newUserList: UserDetailed[]) => this.expandUserList(newUserList)),
      tap((newUserList: ExpandedUserDetailed[]) => this.userList$.update(userList => [...userList, ...newUserList])),
      take(1)
    );
  }

  private filterCurrentUser(userList: UserDetailed[]): UserDetailed[] {
    return userList.filter(user => user.email !== this.authService.getUserNameFromStorage());
  }

  private expandUserList(users: UserDetailed[]): ExpandedUserDetailed[] {
    return users.map(({ socialMedia, ...user }: UserDetailed): ExpandedUserDetailed => {
      return { ...user, socialMedia: this.expandUserSocialMedia(socialMedia) };
    });
  }

  private getDetailedSocials([socialName, userName]: [string, string]): DetailedSocialLink {
    const normalizedSocialName = socialName.toLowerCase();

    return {
      priority: PRIORITY_ORDER[normalizedSocialName as keyof typeof PRIORITY_ORDER],
      link: SOCIAL_PROFILE_LINKS_ROOT[normalizedSocialName](userName),
      type: socialName.toLowerCase() as SOCIAL_ICONS
    };
  }

  private setLastUserEmail(newUserList: UserDetailed[]): void {
    if (!newUserList.length) return;

    this.currentLastUserEmail = newUserList.at(-1)!.email;
    if (newUserList.length < this.limit) {
      this.previousLastUserEmail = this.currentLastUserEmail;
    }
  }

  private isAllUsersInListLoaded(): boolean {
    return !!this.currentLastUserEmail && this.currentLastUserEmail === this.previousLastUserEmail;
  }
}
