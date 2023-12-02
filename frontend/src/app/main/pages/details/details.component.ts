import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, take, tap } from 'rxjs';

import { EpmInputComponent } from '../../../shared/components/epm-input/epm-input.component';
import { EpmButtonComponent } from '../../../shared/components/epm-button/epm-button.component';
import { APP_ROUTER_NAME, BUTTON_THEMES, INPUT_TYPES } from '../../../app.config';
import { AccountDetailsForm, UserDetailed } from '../../main.model';
import { CustomValidators } from '../../../shared/validators/custom.validators';
import { EpmErrorMessageComponent } from '../../../shared/components/epm-error-message/epm-error-message.component';
import { MainApiService } from '../../services/main-api.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'epm-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    EpmInputComponent,
    EpmButtonComponent,
    ReactiveFormsModule,
    EpmErrorMessageComponent
  ],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export default class DetailsComponent implements OnInit {
  accountDetailsForm!: FormGroup<AccountDetailsForm>;
  user!: UserDetailed;

  readonly buttonThemes: typeof BUTTON_THEMES = BUTTON_THEMES;
  readonly appRoutes: typeof APP_ROUTER_NAME = APP_ROUTER_NAME;
  readonly inputTypes: typeof INPUT_TYPES = INPUT_TYPES;

  get email(): FormControl {
    return this.accountDetailsForm.get('email') as FormControl;
  }

  get name(): FormControl {
    return this.accountDetailsForm.get('name') as FormControl;
  }

  constructor(
    private apiService: ApiService,
    private mainApiService: MainApiService,
    private fb: NonNullableFormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.apiService.currentUser()!;
    this.initAccountDetailsForm();
    this.setInitialFormValues();
  }

  onSaveUpdates(): void {
    //TODO add update user in cognito
    this.mainApiService
      .updateUser(this.accountDetailsForm.value)
      .pipe(
        tap(() => this.router.navigateByUrl(`/${this.appRoutes.Main}/${this.appRoutes.ProfileSettings}`)),
        take(1),
        catchError(() => this.router.navigateByUrl(`/${APP_ROUTER_NAME.NotFound}`))
      )
      .subscribe();
  }

  private initAccountDetailsForm(): void {
    this.accountDetailsForm = this.fb.group({
      email: ['', { validators: [Validators.required, Validators.email] }],
      name: ['', { validators: [Validators.required, CustomValidators.userName()] }]
    });
  }

  private setInitialFormValues(): void {
    const { email, name } = this.user;
    this.accountDetailsForm.setValue({ email, name });
  }
}
