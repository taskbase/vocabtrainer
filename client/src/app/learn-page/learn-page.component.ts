import {Component, OnDestroy, OnInit} from '@angular/core';
import {RecommenderService} from '../recommender.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {Bit} from '../bitmark.model';
import {ChatService} from '../taskbase-ui/chat.service';
import {hackathonScript} from '../chat-hackathon-script';
import {ChatMessage} from '../taskbase-ui/tb-chat-message-list/tb-chat-message-list.component';

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
      text: 'Hi! I am Amber, your English teacher. I have prepared a learning session of about 10 minutes. Are you ready?',
    },
  ];

  private scriptProgress: number = 0

  constructor(
    private recommenderService: RecommenderService,
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {
  }

  ngOnInit() {
    const self = this;
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        this.topic = params['topic'];

        if (this.topic == "ASSISTANT") {
          // Follow a scripted interaction for the hackathon
          this.chatMessages = []
          this.scriptProgress = 0;
          this.chatService.messageEvent.subscribe((text) => {
            this.addChatMessage({
              isTaskbase: false,
              text: text
            });
            setTimeout(() => this.advanceScript(), 1000)
          });
          this.advanceScript();
        } else {
          this.chatService.messageEvent.subscribe((text: string) => {
            this.handleUserMessage(text);
          });
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private addChatMessage(chatMessage: ChatMessage) {
    this.chatMessages = [...this.chatMessages, chatMessage];
  }

  private advanceScript() {
    const [scriptElement, action] = hackathonScript[this.scriptProgress];

    this.addChatMessage({
      isTaskbase: true,
      text: scriptElement,
    });

    if (action === null) {
      // Wait for user input
      this.chatService.disabled.next(false)
    } else if (typeof action === "number") {
      // Wait N seconds before advancing
      this.chatService.disabled.next(true);
      setTimeout(() => this.advanceScript(), action * 1000);
    } else if (action === undefined) {
      // End the chat session
      this.chatService.disabled.next(true);
    }

    this.scriptProgress++;
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

      let requestFinished = false;
      this.recommenderService.recommendTask(this.topic).subscribe({
        error: () => {
          requestFinished = true;
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
          this.chatService.disabled.next(false);
        },
        next: (task) => {
          requestFinished = true;
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
        if (!requestFinished) {
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
