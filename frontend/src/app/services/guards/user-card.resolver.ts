import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, EMPTY, Observable, tap } from 'rxjs';

import { ApiService } from '../api.service';
import { UserDetailed } from '../../main/main.model';
import { APP_ROUTER_NAME } from '../../app.config';

export const userCardResolver = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
): Observable<UserDetailed> => {
  const apiService = inject(ApiService);
  const router = inject(Router);
  const userEmail: string = route.paramMap.get('userId')!;

  return apiService.getUser(userEmail).pipe(
    tap(data => {
      if (!data.email) {
        throw new Error();
      }
    }),
    catchError(() => {
      router.navigateByUrl(`/${APP_ROUTER_NAME.NotFound}`);
      return EMPTY;
    })
  );
};
