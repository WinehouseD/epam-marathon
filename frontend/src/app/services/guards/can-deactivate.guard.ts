import { ActivatedRouteSnapshot, CanDeactivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { CanComponentDeactivate } from '../../main/main.model';

export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component: CanComponentDeactivate,
  _currentRoute: ActivatedRouteSnapshot,
  _currentState: RouterStateSnapshot,
  nextState: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  return component.canDeactivate ? component.canDeactivate(nextState) : true;
};
