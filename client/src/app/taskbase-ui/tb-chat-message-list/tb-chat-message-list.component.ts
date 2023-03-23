import { Component, Input } from '@angular/core';

interface ChatMessage {
  isTaskbase: boolean;
  text: string;
}
@Component({
  selector: 'tb-chat-message-list',
  templateUrl: './tb-chat-message-list.component.html',
  styleUrls: ['./tb-chat-message-list.component.scss'],
})
export class TbChatMessageListComponent {
  @Input() messages: ChatMessage[] = [];
}
