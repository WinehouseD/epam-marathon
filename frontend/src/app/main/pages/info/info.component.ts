import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage, TitleCasePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { catchError, debounceTime, distinctUntilChanged, filter, from, map, take, tap } from 'rxjs';

import { EpmButtonComponent } from '../../../shared/components/epm-button/epm-button.component';
import { EpmInputComponent } from '../../../shared/components/epm-input/epm-input.component';
import { EpmChipsListComponent } from '../../../shared/components/epm-chips-list/epm-chips-list.component';
import { MainApiService } from '../../services/main-api.service';
import { CanDeactivateType, ProfileDetailsForm, SocialMedias, UserDetailed } from '../../main.model';
import {
  APP_ROUTER_NAME,
  BUTTON_THEMES,
  MODAL_EDIT_INFO,
  SOCIAL_ICONS,
  SOCIAL_PLACEHOLDERS_CONFIG
} from '../../../app.config';
import { EpmInputAutocompleteComponent } from '../../../shared/components/epm-input-autocomplete/epm-input-autocomplete.component';
import { CITY_LIST } from 'src/assets/data/city';
import { ApiService } from 'src/app/services/api.service';
import { EpmModalComponent } from '../../../shared/components/epm-modal/epm-modal.component';
import { ModalConfig } from '../../../app.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'epm-info',
  standalone: true,
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  imports: [
    CommonModule,
    RouterLink,
    EpmButtonComponent,
    EpmInputComponent,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    EpmChipsListComponent,
    NgOptimizedImage,
    EpmInputAutocompleteComponent,
    EpmModalComponent
  ],
  providers: [TitleCasePipe]
})
export default class InfoComponent implements OnInit, AfterViewInit {
  @ViewChild('modal') modal!: EpmModalComponent;

  @HostListener('window:scroll') onScroll(): void {
    this.isBottomReached = this.checkIsBottomReached();

    if (this.isBottomReached) {
      this.buttonClasses = [this.buttonThemes.Primary];
    } else {
      this.buttonClasses = [this.buttonThemes.Primary, this.buttonThemes.Small];
    }
  }

  user!: UserDetailed;
  datePickerStartDate!: Date;
  profileDetailsForm!: FormGroup<ProfileDetailsForm>;
  buttonClasses!: BUTTON_THEMES[];
  isBottomReached!: boolean;
  locationList!: string[];

  private interestFormData: string[] = [];
  private isFormSaved = false;

  readonly socialIcons: typeof SOCIAL_ICONS = SOCIAL_ICONS;
  readonly socialPlaceholders: typeof SOCIAL_PLACEHOLDERS_CONFIG = SOCIAL_PLACEHOLDERS_CONFIG;
  readonly buttonThemes: typeof BUTTON_THEMES = BUTTON_THEMES;
  readonly appRoutes: typeof APP_ROUTER_NAME = APP_ROUTER_NAME;
  readonly buttonBottomGap = 25;
  readonly modalConfig: ModalConfig = MODAL_EDIT_INFO;

  get socialControls(): FormGroup<SocialMedias> {
    return this.profileDetailsForm.controls.socialMedia;
  }

  constructor(
    private apiService: ApiService,
    private mainApiService: MainApiService,
    private fb: NonNullableFormBuilder,
    private cd: ChangeDetectorRef,
    private router: Router,
    private titleCasePipe: TitleCasePipe,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.apiService.currentUser()!;
    this.datePickerStartDate = this.user.birthday ? new Date(this.user.birthday!) : new Date();
    this.initForm();
    this.initValueChangesSubscription();
    this.setInitialFormValues();
  }

  ngAfterViewInit(): void {
    this.onScroll();
    this.cd.detectChanges();
  }

  onInterestsChange(interests: string[]): void {
    this.interestFormData = interests;
  }

  onSaveUpdates(): void {
    const formData = {
      birthday: new Date(this.profileDetailsForm.controls.birthday.value).getTime(),
      location: this.profileDetailsForm.controls.location.value,
      about: this.profileDetailsForm.controls.about.value,
      socialMedia: {
        linkedin: this.socialControls.controls.linkedin.value,
        telegram: this.socialControls.controls.telegram.value,
        skype: this.socialControls.controls.skype.value,
        instagram: this.socialControls.controls.instagram.value,
        facebook: this.socialControls.controls.facebook.value
      },
      interests: this.interestFormData
    };

    this.mainApiService
      .updateUser(formData)
      .pipe(
        tap(() => (this.isFormSaved = true)),
        tap(() => this.router.navigateByUrl(`/${this.appRoutes.Main}/${this.appRoutes.ProfileSettings}`)),
        take(1),
        catchError(() => this.router.navigateByUrl(`/${APP_ROUTER_NAME.NotFound}`))
      )
      .subscribe();
  }

  canDeactivate(): CanDeactivateType {
    if (!this.authService.isUserLoggedIn()) {
      return true;
    }

    if (!this.isFormSaved && this.profileDetailsForm.dirty) {
      this.modal.openModal();

      return from(this.modal.secondaryButton).pipe(
        map(() => true),
        take(1)
      );
    }

    return true;
  }

  private initForm(): void {
    this.profileDetailsForm = this.fb.group({
      birthday: [''],
      location: [''],
      about: [''],
      socialMedia: this.fb.group({
        instagram: [''],
        linkedin: [''],
        facebook: [''],
        skype: [''],
        telegram: ['']
      })
    });
  }

  private setInitialFormValues(): void {
    const { birthday, interests } = this.user;
    this.profileDetailsForm.patchValue({
      ...this.user,
      birthday: birthday ? new Date(birthday).toISOString() : ''
    });
    this.interestFormData = interests;
  }

  private checkIsBottomReached(): boolean {
    return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - this.buttonBottomGap;
  }

  private initValueChangesSubscription(): void {
    this.profileDetailsForm.controls.location.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter(value => !!value && value?.length > 2),
        map(value => {
          const prompt = this.titleCasePipe.transform(value);
          return CITY_LIST.filter((cityName: string) => cityName.startsWith(prompt));
        }),
        tap(optionsList => (this.locationList = optionsList))
      )
      .subscribe();
  }
}
