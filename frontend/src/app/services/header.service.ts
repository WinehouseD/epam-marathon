import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Scroll } from '@angular/router';
import { filter, map, mergeMap, Observable, tap } from 'rxjs';
import { Location } from '@angular/common';

import { HeaderConfig } from '../app.model';
import { HEADER_CONFIG_LIST, HEADER_CONFIG_NAME } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private headerSettings$: WritableSignal<HeaderConfig> = signal(HEADER_CONFIG_LIST[HEADER_CONFIG_NAME.mainRoot]);
  headerSettings: Signal<HeaderConfig> = computed(this.headerSettings$);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  initSubscription(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd || event instanceof Scroll),
        map(() => this.rootRoute(this.route)),
        mergeMap((route: ActivatedRoute): Observable<HeaderConfig> => route.data as Observable<HeaderConfig>),
        tap((event: HeaderConfig) => {
          this.headerSettings$.set(event);
        })
      )
      .subscribe();
  }

  addTitle(title: string): void {
    this.headerSettings$.update(settings => ({ ...settings, title }));
  }

  back(): void {
    this.location.back();
  }

  private rootRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
}
