import { Component, OnDestroy, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { APP_ROUTER_NAME } from '../../../app.config';
import { ContactListItemComponent } from '../../components/contact-list-item/contact-list-item.component';
import { ExpandedUserDetailed } from '../../main.model';
import { MainApiService } from '../../services/main-api.service';
import { EpmLoaderComponent } from '../../../shared/components/epm-loader/epm-loader.component';
import { EpmPaginationDirective } from 'src/app/shared/directives/pagination.directive.';
import { take } from 'rxjs';
import { FilterService } from '../../services/filter.service';
import { LoaderService } from 'src/app/shared/components/epm-loader/loader.service';
import { EpmToTopButtonComponent } from 'src/app/shared/components/to-top/to-top-button.component';

@Component({
  selector: 'epm-contact-list',
  standalone: true,
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
  imports: [CommonModule, ContactListItemComponent, EpmLoaderComponent, EpmPaginationDirective, EpmToTopButtonComponent]
})
export class ContactListComponent implements OnInit, OnDestroy {
  userList!: Signal<ExpandedUserDetailed[]>;
  isLoading!: Signal<boolean>;

  constructor(
    private router: Router,
    private mainApiService: MainApiService,
    private filterService: FilterService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.userList = this.mainApiService.userList;
    this.isLoading = this.loaderService.isLoading;
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.mainApiService.clearUserList();
  }

  onOpenUser(userId: string): void {
    this.router.navigateByUrl(`${APP_ROUTER_NAME.Main}/${APP_ROUTER_NAME.Contact}/${userId}`);
  }

  loadUsers(): void {
    if (this.filterService.filterChipsList().length) {
      this.filterService.getFilteredUsers();
    } else {
      this.mainApiService.getUserList().pipe(take(1)).subscribe();
    }
  }
}
