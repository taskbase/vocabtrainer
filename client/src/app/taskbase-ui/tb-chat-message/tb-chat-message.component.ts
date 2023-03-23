import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'tb-chat-message',
  templateUrl: './tb-chat-message.component.html',
  styleUrls: ['./tb-chat-message.component.scss'],
})
export class TbChatMessageComponent {
  @Input() isTaskbase = true;
  @Input() text = '';
}
