import { Injectable } from '@angular/core';
import { Amplify, Auth } from 'aws-amplify';
import { take, from, Observable, tap, switchMap, map } from 'rxjs';

import { environment } from 'src/environments/environment';
import { LoginData, UserAuthData } from '../auth/auth.model';
import { STORAGE_KEY } from '../app.config';
import { WsService } from './ws.service';
import { convertUserNameToEmail } from '../shared/utils/convertUserNameToEmail';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {
  constructor(private wsService: WsService) {
    this.initAmplify();
  }

  signUp({ email: userMail, password, familyName, givenName }: UserAuthData): Observable<any> {
    const userName = this.toUsername(userMail).toLowerCase();
    return from(
      Auth.signUp({
        username: userName,
        password: password,
        attributes: {
          given_name: givenName,
          family_name: familyName,
          email: userMail
        }
      })
    );
  }

  signIn({ email, password }: LoginData): Observable<any> {
    const normalizedEmail = convertUserNameToEmail(email.toLowerCase());

    return from(Auth.signIn(normalizedEmail, password)).pipe(
      tap(() => {
        sessionStorage.setItem(STORAGE_KEY.userEmail, JSON.stringify(normalizedEmail));
      }),
      switchMap(() => this.getToken()),
      tap(this.saveTokenInStorage),
      tap(() => this.wsService.connect(normalizedEmail))
    );
  }

  forgotPassword(email: string): Observable<any> {
    const normalizedEmail = email.toLowerCase();

    return from(Auth.forgotPassword(normalizedEmail)).pipe(take(1));
  }

  forgotPasswordSubmit(email: string, code: string, newPassword: string): Observable<any> {
    const normalizedEmail = email.toLowerCase();

    return from(Auth.forgotPasswordSubmit(normalizedEmail, code, newPassword)).pipe(take(1));
  }

  logout(): Observable<any> {
    return from(Auth.signOut()).pipe(tap(() => this.wsService.close()));
  }

  private getToken(): Observable<any> {
    return from(Auth.currentSession()).pipe(map(res => res.getIdToken().getJwtToken()));
  }

  private saveTokenInStorage(token: string) {
    sessionStorage.setItem(STORAGE_KEY.accessToken, token);
  }

  private initAmplify(): void {
    setTimeout(() => {
      Amplify.configure({
        Auth: {
          userPoolId: environment.cognito.userPoolId,
          userPoolWebClientId: environment.cognito.clientId
        },
        storage: window.sessionStorage
      });
    });
  }

  private toUsername(email: string): string {
    return email.replace('@', '-at-');
  }
}
