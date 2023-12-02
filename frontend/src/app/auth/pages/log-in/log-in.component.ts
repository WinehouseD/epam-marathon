import { Component, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_ROUTER_NAME, BUTTON_THEMES, INPUT_TYPES } from '../../../app.config';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, EMPTY, finalize, Observable, switchMap, tap } from 'rxjs';

import { EpmInputComponent } from '../../../shared/components/epm-input/epm-input.component';
import { EpmButtonComponent } from '../../../shared/components/epm-button/epm-button.component';
import { LoginData, LoginForm } from '../../auth.model';
import { CognitoService } from '../../../services/cognito.service';
import { AuthService } from '../../../services/auth.service';
import { COGNITO_ERROR_MESSAGES } from '../../auth.config';
import { EpmErrorMessageComponent } from '../../../shared/components/epm-error-message/epm-error-message.component';
import { LoaderService } from '../../../shared/components/epm-loader/loader.service';
import { EpmLoaderComponent } from '../../../shared/components/epm-loader/epm-loader.component';

@Component({
  selector: 'epm-log-in',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    EpmInputComponent,
    EpmButtonComponent,
    ReactiveFormsModule,
    EpmErrorMessageComponent,
    EpmLoaderComponent
  ],
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {
  loginForm!: FormGroup<LoginForm>;
  requestInProgress: Signal<boolean> = this.loaderService.isLoading;

  readonly appRoutes: typeof APP_ROUTER_NAME = APP_ROUTER_NAME;
  readonly buttonThemes: typeof BUTTON_THEMES = BUTTON_THEMES;
  readonly inputTypes: typeof INPUT_TYPES = INPUT_TYPES;

  get email(): FormControl {
    return this.loginForm.controls.email;
  }

  get password(): FormControl {
    return this.loginForm.controls.password;
  }

  get isFormValid(): boolean {
    return this.loginForm.valid;
  }

  constructor(
    private router: Router,
    private fb: NonNullableFormBuilder,
    private cognitoService: CognitoService,
    private authService: AuthService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.initLoginForm();
  }

  onLogIn(): void {
    const userCredentials: LoginData = {
      email: this.email.value.toLowerCase(),
      password: this.password.value
    };

    this.loaderService.showLoader();
    this.cognitoService
      .signIn(userCredentials)
      .pipe(
        switchMap(() => this.authService.getCurrentUser(userCredentials.email)),
        tap(() => this.router.navigateByUrl(`/${this.appRoutes.Main}`)),
        catchError(error => this.errorHandler(error.message)),
        finalize(() => this.loaderService.hideLoader())
      )
      .subscribe();
  }

  private initLoginForm(): void {
    this.loginForm = this.fb.group({
      email: ['', { validators: [Validators.required] }],
      password: ['', { validators: [Validators.required] }]
    });
  }

  private errorHandler(message: string): Observable<never> {
    switch (message) {
      case COGNITO_ERROR_MESSAGES.IncorrectUser:
        this.loginForm.get('email')?.setErrors({ emailWrong: true });
        break;
      case COGNITO_ERROR_MESSAGES.IncorrectPassword:
        this.loginForm.get('password')?.setErrors({ passwordWrong: true });
        break;
      default:
        this.router.navigateByUrl(`/${APP_ROUTER_NAME.NotFound}`);
    }

    return EMPTY;
  }
}
