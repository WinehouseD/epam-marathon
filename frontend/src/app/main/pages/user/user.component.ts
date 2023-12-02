import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { take, tap } from 'rxjs';

import { APP_ROUTER_NAME, BUTTON_THEMES } from '../../../app.config';
import { DetailedSocialLink, ExpandedUserDetailed, UserDetailed } from '../../main.model';
import { ContactComponent } from '../../components/contact/contact.component';
import { ContactHeadComponent } from '../../components/contact-head/contact-head.component';
import { EpmButtonComponent } from '../../../shared/components/epm-button/epm-button.component';
import { ContactAboutComponent } from '../../components/contact-about/contact-about.component';
import { ContactInterestsComponent } from '../../components/contact-interests/contact-interests.component';
import { ContactNoDetailsComponent } from '../../components/contact-no-details/contact-no-details.component';
import { MainApiService } from '../../services/main-api.service';

@Component({
  selector: 'epm-user',
  standalone: true,
  imports: [
    CommonModule,
    ContactComponent,
    ContactHeadComponent,
    EpmButtonComponent,
    ContactAboutComponent,
    ContactInterestsComponent,
    ContactNoDetailsComponent
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export default class UserComponent implements OnInit {
  user!: ExpandedUserDetailed;
  isAdditionalInfoVisible!: boolean;

  readonly buttonThemes: typeof BUTTON_THEMES = BUTTON_THEMES;

  constructor(
    private title: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private mainApiService: MainApiService
  ) {}

  ngOnInit(): void {
    this.setPageTitle();
    this.initializeUserCard();
    this.isAdditionalInfoVisible = !!(this.user.about || this.user.interests.length) && !this.user.privacy.account;
  }

  onOpenChat(userId: string): void {
    this.router.navigateByUrl(`${APP_ROUTER_NAME.Main}/${APP_ROUTER_NAME.Chat}/${userId}`);
  }

  private initializeUserCard(): void {
    this.activatedRoute.data
      .pipe(
        tap(data => {
          const userCard: UserDetailed = data['userCard'];
          const socialMedia: DetailedSocialLink[] = this.mainApiService.expandUserSocialMedia(userCard.socialMedia);
          this.user = { ...userCard, socialMedia };
        }),
        take(1)
      )
      .subscribe();
  }

  private setPageTitle(): void {
    if (this.user) {
      this.title.setTitle(`U-PAMERS | ${this.user.name} profile`);
    }
  }
}
