import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable, take, tap } from 'rxjs';

import { UserDetailed } from '../main/main.model';
import { FilterQueryConfig } from '../main/main.config';

const BASE_URL = environment.apiBaseUrl;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly currentUser$: WritableSignal<UserDetailed | null> = signal(null);

  readonly currentUser: Signal<UserDetailed | null> = this.currentUser$.asReadonly();

  constructor(private http: HttpClient) {}

  getUserList(limit: number, hashKey: string): Observable<UserDetailed[]> {
    return this.http.get<UserDetailed[]>(`${BASE_URL}/users?limit=${limit}&hashkey=${hashKey}`).pipe(take(1));
  }

  getFilteredUserList(query: FilterQueryConfig, limit: number, rangekey: string): Observable<UserDetailed[]> {
    return this.http.post<UserDetailed[]>(`${BASE_URL}/match?limit=${limit}&rangekey=${rangekey}`, query).pipe(take(1));
  }

  getUser(id: string): Observable<UserDetailed> {
    return this.http.get<UserDetailed>(`${BASE_URL}/users/${id}`).pipe(take(1));
  }

  getCurrentUser(id: string): Observable<UserDetailed> {
    return this.getUser(id).pipe(
      tap(user => {
        this.currentUser$.set(user);
      })
    );
  }

  updateUser(id: string, userData: Partial<UserDetailed>): Observable<string> {
    return this.http.put<string>(`${BASE_URL}/users/${id}`, userData).pipe(take(1));
  }

  createUser(userData: UserDetailed): Observable<string> {
    return this.http.post<string>(`${BASE_URL}/users`, userData).pipe(take(1));
  }

  clearUserData(): void {
    this.currentUser$.set(null);
    sessionStorage.clear();
  }
}
