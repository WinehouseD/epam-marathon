import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private readonly imageChangedEvent$: WritableSignal<Event> = signal({} as Event);
  private readonly fileEventDraft$: WritableSignal<Event> = signal({} as Event);
  private readonly croppedImage$: WritableSignal<ImageCroppedEvent> = signal({} as ImageCroppedEvent);
  private readonly userAvatarDraft$: WritableSignal<string> = signal('');

  readonly imageChangedEvent: Signal<Event> = this.imageChangedEvent$.asReadonly();
  readonly fileEventDraft: Signal<Event> = this.fileEventDraft$.asReadonly();
  readonly croppedImage: Signal<ImageCroppedEvent> = this.croppedImage$.asReadonly();
  readonly userAvatarDraft: Signal<string> = this.userAvatarDraft$.asReadonly();

  setImageChangeEvent(event: Event): void {
    this.imageChangedEvent$.set(event);
  }

  setFileEventDraft(event: Event): void {
    this.fileEventDraft$.set(event);
  }

  setCroppedImage(event: ImageCroppedEvent): void {
    this.croppedImage$.set(event);
  }

  setUserAvatarDraft(event: string): void {
    this.userAvatarDraft$.set(event);
  }
}
