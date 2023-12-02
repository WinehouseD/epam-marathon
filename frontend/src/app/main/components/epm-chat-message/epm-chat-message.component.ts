import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Message } from '../../main.model';
import { EpmLoaderComponent } from '../../../shared/components/epm-loader/epm-loader.component';

@Component({
  selector: 'epm-chat-message',
  standalone: true,
  templateUrl: './epm-chat-message.component.html',
  styleUrls: ['./epm-chat-message.component.scss'],
  imports: [CommonModule, EpmLoaderComponent]
})
export class EpmChatMessageComponent {
  @Input({ required: true }) message!: Message | true;
}
