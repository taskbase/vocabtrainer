import { Component, Input } from '@angular/core';

export interface ChatMessage {
  isTaskbase: boolean;
  text?: string;
  audio?: string;
  options?: string[];
}
@Component({
  selector: 'tb-chat-message-list',
  templateUrl: './tb-chat-message-list.component.html',
  styleUrls: ['./tb-chat-message-list.component.scss'],
})
export class TbChatMessageListComponent {
  @Input() messages: ChatMessage[] = [];
}
