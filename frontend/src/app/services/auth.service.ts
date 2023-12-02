import { Injectable } from '@angular/core';
import { Observable, switchMap, take } from 'rxjs';

import { UserAuthData, UserAuthFormData } from '../auth/auth.model';
import { DRAFT_FORM_INITIAL_VALUE } from '../auth/auth.config';
import { UserDetailed } from '../main/main.model';
import { ApiService } from './api.service';
import { STORAGE_KEY } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private draftAuthForm: UserAuthData = structuredClone(DRAFT_FORM_INITIAL_VALUE);

  constructor(private apiService: ApiService) {}

  saveFormValue(formValue: UserAuthFormData): void {
    delete (formValue as Partial<UserAuthFormData>).repeatPassword;
    this.draftAuthForm = { ...this.draftAuthForm, ...this.filterFormValue(formValue) };
  }

  getDraftFormValue(): UserAuthData {
    return this.draftAuthForm;
  }

  resetDraftFormValue(): void {
    this.draftAuthForm = structuredClone(DRAFT_FORM_INITIAL_VALUE);
  }

  createUser(userData: UserDetailed): Observable<UserDetailed> {
    return this.apiService.createUser(userData).pipe(
      take(1),
      switchMap(() => this.apiService.getCurrentUser(userData.email))
    );
  }

  getCurrentUser(userMail: string): Observable<UserDetailed> {
    return this.apiService.getCurrentUser(userMail).pipe(take(1));
  }

  isUserLoggedIn(): boolean {
    return !!(this.apiService.currentUser() || this.getUserNameFromStorage());
  }

  getUserNameFromStorage(): string {
    const data = sessionStorage.getItem(STORAGE_KEY.userEmail);
    return data ? JSON.parse(data) : '';
  }

  private filterFormValue<T extends object>(formValue: T): T {
    Object.entries(formValue).forEach(([key, value]) => {
      if (!value) {
        delete formValue[key as keyof T];
      }

      if (typeof value === 'object' && Object.entries(value).length) {
        formValue[key as keyof T] = this.filterFormValue(value);
      }

      if (typeof value === 'object' && !Object.entries(value).length) {
        delete formValue[key as keyof T];
      }
    });

    return formValue;
  }
}
