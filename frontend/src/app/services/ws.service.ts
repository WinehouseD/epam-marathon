import { Injectable } from '@angular/core';
import { catchError, delayWhen, EMPTY, Observable, retryWhen, Subject, switchAll, tap, timer } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import { environment } from '../../environments/environment';

const BASE_URL = environment.wsUrl;

@Injectable({
  providedIn: 'root'
})
export class WsService {
  readonly RECONNECT_INTERVAL = 2000;

  socket$!: WebSocketSubject<any>;

  private messagesSubject$: Subject<any> = new Subject();
  messages$ = this.messagesSubject$.pipe(
    switchAll(),
    catchError(e => {
      throw e;
    })
  );

  connect(userId: string, config: { reconnect: boolean } = { reconnect: false }) {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getSocket(userId);
      const messages = this.socket$.pipe(
        config.reconnect ? this.reconnect : o => o,
        tap({
          error: error => console.log(error)
        }),
        catchError(_ => EMPTY)
      );

      this.messagesSubject$.next(messages);
    }
  }

  reconnect(observable: Observable<any>) {
    return observable.pipe(
      retryWhen(errors =>
        errors.pipe(
          tap(val => console.log('[WS Service] Try to reconnect', val)),
          delayWhen(_ => timer(this.RECONNECT_INTERVAL))
        )
      )
    );
  }

  close() {
    this.socket$.complete();
    this.socket$ = null!;
  }

  sendMessage(msg: {
    SenderName: string;
    SenderAvatar: string;
    SenderId: string;
    ReceiverId: string;
    Message: string;
  }) {
    this.socket$.next(msg);
  }

  private getSocket(userId: string) {
    return webSocket({
      url: `${BASE_URL}?userId=${userId}`,
      openObserver: {
        next: () => {
          console.log('connection ok');
        }
      },
      closeObserver: {
        next: () => {
          console.log('connection closed');
          this.socket$ = null!;
          this.connect(userId, { reconnect: true });
        }
      }
    });
  }
}
