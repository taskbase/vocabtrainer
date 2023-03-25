import { Component, Input } from '@angular/core';
import { ChatMessage } from '../tb-chat-message-list/tb-chat-message-list.component';

@Component({
  selector: 'tb-chat-message',
  templateUrl: './tb-chat-message.component.html',
  styleUrls: ['./tb-chat-message.component.scss'],
})
export class TbChatMessageComponent {
  @Input() message: ChatMessage = {
    isTaskbase: true,
    text: 'Default',
  };
}
