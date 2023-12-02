import { Component, ElementRef, Signal, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { ImageCroppedEvent, ImageCropperModule, ImageTransform } from 'ngx-image-cropper';
import 'hammerjs';
import { catchError, take, tap } from 'rxjs';
import { NgxImageCompressService } from 'ngx-image-compress';

import { EpmButtonComponent } from '../epm-button/epm-button.component';
import { APP_ROUTER_NAME } from '../../../app.config';
import { AvatarService } from '../../../services/avatar.service';
import { ApiService } from '../../../services/api.service';
import { MainApiService } from '../../../main/services/main-api.service';

@Component({
  selector: 'epm-avatar-edit',
  standalone: true,
  imports: [CommonModule, EpmButtonComponent, ImageCropperModule],
  templateUrl: './avatar-edit.component.html',
  styleUrls: ['./avatar-edit.component.scss']
})
export default class AvatarEditComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  transform: ImageTransform = {};

  readonly appRoutes: typeof APP_ROUTER_NAME = APP_ROUTER_NAME;
  readonly imageChangedEvent: Signal<Event> = this.avatarService.imageChangedEvent;

  constructor(
    private avatarService: AvatarService,
    private router: Router,
    private location: Location,
    private apiService: ApiService,
    private mainApiService: MainApiService,
    private imageCompress: NgxImageCompressService
  ) {}

  imageCropped(event: ImageCroppedEvent): void {
    this.avatarService.setCroppedImage(event);
  }

  onSavePhoto(): void {
    this.setUserAvatarDraft();
    this.avatarService.setFileEventDraft(this.avatarService.imageChangedEvent());
  }

  onChangePhoto(): void {
    this.fileInput.nativeElement.click();
  }

  fileChangeEvent(event: Event): void {
    if ((event.target as HTMLInputElement).value) {
      this.avatarService.setImageChangeEvent(event);
    }
  }

  private setUserAvatarDraft(): void {
    this.imageCompress.compressFile(this.avatarService.croppedImage().objectUrl!, 0, 50, 75).then(compressedImage => {
      this.avatarService.setUserAvatarDraft(compressedImage);
      this.updateUserAvatarAndLeave();
    });
  }

  private updateUserAvatarAndLeave(): void {
    if (this.apiService.currentUser()) {
      this.mainApiService
        .updateUser({ avatar: this.avatarService.userAvatarDraft() })
        .pipe(
          tap(() => this.location.back()),
          take(1),
          catchError(() => this.router.navigateByUrl(`/${APP_ROUTER_NAME.NotFound}`))
        )
        .subscribe();
    } else {
      this.location.back();
    }
  }
}
