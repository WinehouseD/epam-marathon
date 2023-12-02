import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AuthService } from '../auth.service';
import { ApiService } from '../api.service';
import { UserDetailed } from '../../main/main.model';

export const userPersonalDataResolver = (
  _route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
): Observable<UserDetailed | null> => {
  const apiService = inject(ApiService);
  const authService = inject(AuthService);
  const currentUser: UserDetailed | null = apiService.currentUser();
  const userEmail: string = authService.getUserNameFromStorage();

  if (currentUser) {
    return of(currentUser);
  }
  if (userEmail) {
    return apiService.getCurrentUser(userEmail);
  }

  return of(null);
};
