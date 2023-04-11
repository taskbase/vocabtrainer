import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChatService } from '../chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tb-chat-input',
  templateUrl: './tb-chat-input.component.html',
  styleUrls: ['./tb-chat-input.component.scss'],
})
export class TbChatInputComponent implements OnInit, OnDestroy, AfterViewInit {
  inputText: string = '';
  autoFocus: boolean = true;
  disabled = false;

  @ViewChild('userInput')
  inputElement: ElementRef | undefined;

  subscriptions: Subscription[] = [];
  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.disabled.subscribe((isDisabled) => {
      this.disabled = isDisabled;
      if (!isDisabled) {
        this.focus();
      }
    });
  }

  ngAfterViewInit(): void {
    this.focus();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  focus() {
    setTimeout(() => {
      this.inputElement?.nativeElement.focus();
    }, 0);
  }

  onEnter() {
    this.chatService.messageEvent.next(this.inputText);
    this.inputText = '';
  }
}
