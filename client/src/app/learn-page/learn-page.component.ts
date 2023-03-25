import { Component, OnDestroy, OnInit } from '@angular/core';
import { RecommenderService } from '../recommender.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Bit } from '../bitmark.model';
import { ChatService } from '../taskbase-ui/chat.service';
import { ChatMessage } from '../taskbase-ui/tb-chat-message-list/tb-chat-message-list.component';

@Component({
  selector: 'app-learn-page',
  templateUrl: './learn-page.component.html',
  styleUrls: ['./learn-page.component.scss'],
})
export class LearnPageComponent implements OnInit, OnDestroy {
  topic: string = this.recommenderService.topics[0];
  task: Bit | null = null;
  subscriptions: Subscription[] = [];
  readonly thinkingMessage = `Thinking...`;

  chatMessages: ChatMessage[] = [
    {
      isTaskbase: true,
      text: 'Hi I am Amber, your English teacher. I have prepared a learning session of about 10 minutes. Are you ready?',
    },
  ];

  constructor(
    private recommenderService: RecommenderService,
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        this.topic = params['topic'];
      })
    );
    this.chatService.messageEvent.subscribe((text: string) => {
      this.handleUserMessage(text);
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private addChatMessage(chatMessage: ChatMessage) {
    this.chatMessages = [...this.chatMessages, chatMessage];
  }

  private handleUserMessage(text: string) {
    {
      // add new message to list of messages
      this.addChatMessage({
        isTaskbase: false,
        text,
      });

      // disable input field until complete
      this.chatService.disabled.next(true);

      let taskReceived = false;
      this.recommenderService.recommendTask(this.topic).subscribe({
        error: () => {
          this.addChatMessage({
            isTaskbase: true,
            text: this.pickRandomElement([
              `Man, this server really isn't working today. I wonder who's fault it is?`,
              `Lol, server fault`,
              `I'm feeling sleepy, not answering this today. (server error)`,
              `Give me a break please. (server error)`,
              `Can you think about something easier? (server error)`,
              `1+1 = 226662552 (server error)`,
            ]),
          });
        },
        next: (task) => {
          taskReceived = true;
          this.removeThinkingMessage();
          const chosenTask = task.bitmark.essay;
          if (chosenTask.instruction) {
            this.addChatMessage({
              isTaskbase: true,
              text: chosenTask.instruction,
            });
          }
          if (chosenTask.resource?.audio?.src) {
            this.addChatMessage({
              isTaskbase: true,
              audio: chosenTask.resource?.audio?.src,
            });
          }
          this.chatService.disabled.next(false);
        },
      });

      // add a temporary thinking message...
      setTimeout(() => {
        if (!taskReceived) {
          this.addChatMessage({
            isTaskbase: true,
            text: this.thinkingMessage,
          });
        }
      }, 200);
    }
  }

  private removeThinkingMessage() {
    if (
      this.chatMessages[this.chatMessages.length - 1].text ===
      this.thinkingMessage
    ) {
      this.chatMessages = [...this.chatMessages.slice(0, -1)];
    }
  }

  private pickRandomElement<T>(arr: T[]): T {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }
}
