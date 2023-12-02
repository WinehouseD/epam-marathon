import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, catchError, take, takeUntil, tap } from 'rxjs';

import { PrivacyStatusForm, UserDetailed, UserPrivacy } from '../../main.model';
import { DISABLED_PRIVACY_ITEMS } from '../../main.config';
import { MainApiService } from '../../services/main-api.service';
import { APP_ROUTER_NAME } from 'src/app/app.config';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'epm-privacy',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export default class PrivacyComponent implements OnInit {
  privacyStatusForm!: FormGroup<PrivacyStatusForm>;
  user!: UserDetailed;

  private destroyed: Subject<void> = new Subject<void>();

  readonly appRoutes: typeof APP_ROUTER_NAME = APP_ROUTER_NAME;

  private readonly destroyed$: Observable<void> = this.destroyed.asObservable();

  get account(): FormControl {
    return this.privacyStatusForm.get('account') as FormControl;
  }

  get age(): FormControl {
    return this.privacyStatusForm.get('privacyItems.age') as FormControl;
  }

  get location(): FormControl {
    return this.privacyStatusForm.get('privacyItems.location') as FormControl;
  }

  get description(): FormControl {
    return this.privacyStatusForm.get('privacyItems.description') as FormControl;
  }

  constructor(
    private fb: NonNullableFormBuilder,
    private apiService: ApiService,
    private mainApiService: MainApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.apiService.currentUser()!;
    this.initPrivacyStatusForm();
    this.initAccountChangesSubscription();
    this.setInitialFormValues();
  }

  onPrivacyChange(): void {
    setTimeout(() => {
      this.updateUser();
    });
  }

  private initPrivacyStatusForm(): void {
    this.privacyStatusForm = this.fb.group({
      account: [false],
      privacyItems: this.fb.group({
        age: [false],
        location: [false],
        description: [false]
      })
    });
  }

  private initAccountChangesSubscription(): void {
    this.account.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        tap(() => {
          this.handlePrivacyValueChange(this.account.value);
        })
      )
      .subscribe();
  }

  private handlePrivacyValueChange(isChecked: boolean): void {
    if (isChecked) {
      this.privacyStatusForm.get('privacyItems')?.setValue(DISABLED_PRIVACY_ITEMS);
      this.privacyStatusForm.get('privacyItems')?.disable();
    } else {
      this.privacyStatusForm.get('privacyItems')?.enable();
    }
  }

  private setInitialFormValues(): void {
    const { age, location, description, account } = this.user.privacy;
    this.privacyStatusForm.setValue({
      account,
      privacyItems: {
        age: age ?? false,
        location: location ?? false,
        description: description ?? false
      }
    });
  }

  private updateUser(): void {
    const { account, privacyItems } = this.privacyStatusForm.value;

    this.mainApiService
      .updateUser({
        privacy: { account, ...privacyItems } as UserPrivacy
      })
      .pipe(
        take(1),
        catchError(() => this.router.navigateByUrl(`/${APP_ROUTER_NAME.NotFound}`))
      )
      .subscribe();
  }
}
