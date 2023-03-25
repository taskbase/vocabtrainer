import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tb-chat-input',
  templateUrl: './tb-chat-input.component.html',
  styleUrls: ['./tb-chat-input.component.scss'],
})
export class TbChatInputComponent implements OnInit, OnDestroy {
  inputText: string = '';
  disabled = false;

  subscriptions: Subscription[] = [];
  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.disabled.subscribe((isDisabled) => {
      this.disabled = isDisabled;
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onEnter() {
    this.chatService.messageEvent.next(this.inputText);
    this.inputText = '';
  }
}
