import { Component, OnDestroy, OnInit } from '@angular/core';
import { RecommenderService } from '../recommender.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Bit, EssayBit } from '../bitmark.model';
import { ChatService } from '../taskbase-ui/chat.service';
import { ChatMessage } from '../taskbase-ui/tb-chat-message-list/tb-chat-message-list.component';
import { RecommendTaskResponse } from '../recommend.model';
import { SUCCESS_MESSAGES } from '../mocks';

enum ChatState {
  INITIAL = 'INITIAL',
  USER_READY = 'USER_READY',
  DIFFICULTY4 = 'DIFFICULTY4',
  DIFFICULTY3 = 'DIFFICULTY3',
  DIFFICULTY2 = 'DIFFICULTY2',
  DIFFICULTY1 = 'DIFFICULTY1',
}

@Component({
  selector: 'app-learn-page',
  templateUrl: './learn-page.component.html',
  styleUrls: ['./learn-page.component.scss'],
})
export class LearnPageComponent implements OnInit, OnDestroy {
  topic: string = this.recommenderService.topics[0];
  currentTask: Bit | null = null;
  subscriptions: Subscription[] = [];
  readonly thinkingMessage = `Thinking...`;

  readonly successMessages = SUCCESS_MESSAGES;

  solvedTasksCounter = 0;

  state: ChatState = ChatState.INITIAL;

  chatMessages: ChatMessage[] = [
    {
      isTaskbase: true,
      text: 'Hi I am Amber, your English teacher. I have prepared a learning session of about 10 minutes. Are you ready?',
    },
  ];

  readonly taskLimit = 3;

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

      const handlers: Record<ChatState, Function> = {
        [ChatState.INITIAL]: () => {
          if (
            text.toLowerCase().indexOf('yes') > -1 ||
            text.toLowerCase().indexOf('sure') > -1
          ) {
            this.addChatMessage({
              isTaskbase: true,
              text: `Great, let's start then!`,
            });
            this.fetchNextTask();
          } else {
            this.addChatMessage({
              isTaskbase: true,
              text: `Is that a yes?`,
            });
          }
        },
        [ChatState.USER_READY]: () => {
          this.fetchNextTask();
        },
        [ChatState.DIFFICULTY4]: () => {
          this.handleAttempt(text);
        },
        [ChatState.DIFFICULTY3]: () => {},
        [ChatState.DIFFICULTY2]: () => {},
        [ChatState.DIFFICULTY1]: () => {},
      };
      handlers[this.state]();
    }
  }

  private handleAttempt(text: string) {
    (this.currentTask as EssayBit).answer.text = text;
    this.recommenderService.feedback(this.currentTask as Bit).subscribe({
      next: (bit: any) => {
        const isCorrect = bit.feedback.every(
          (feedback: any) => feedback.correctness === 'CORRECT'
        );
        if (isCorrect) {
          this.solvedTasksCounter++;
          if (this.solvedTasksCounter < this.taskLimit) {
            this.addChatMessage({
              isTaskbase: true,
              text: this.pickRandomElement(this.successMessages),
            });
            this.fetchNextTask();
          } else {
            this.addChatMessage({
              isTaskbase: true,
              text: `You've completed all ${this.taskLimit} tasks we've asked. Woohoo! Go back to the dashboard to check your mastery.`,
            });
          }
        } else {
          this.handleWrongAttempt(bit);
        }
      },
      error: () => {
        this.genericErrorHandler();
      },
    });
  }

  private handleWrongAttempt(bit: any) {
    bit.feedback.forEach((feedback: any) => {
      this.addChatMessage({
        isTaskbase: true,
        text: feedback.message,
      });
    });
    if (this.state === ChatState.DIFFICULTY4) {
      this.state = ChatState.DIFFICULTY3;
      this.addChatMessage({
        isTaskbase: true,
        text: ``,
      });
    }
  }

  private fetchNextTask() {
    // disable input field until complete
    this.chatService.disabled.next(true);

    let requestFinished = false;
    this.recommenderService.recommendTask(this.topic).subscribe({
      error: () => {
        requestFinished = true;
        this.genericErrorHandler();
      },
      next: (task) => {
        requestFinished = true;
        this.removeThinkingMessage();
        this.handleTaskReceived(task);
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

  private handleTaskReceived(task: RecommendTaskResponse) {
    this.state = ChatState.DIFFICULTY4;
    const chosenTask = task.bitmark.essay;
    this.currentTask = chosenTask;
    if (chosenTask.instruction) {
      this.addChatMessage({
        isTaskbase: true,
        text: chosenTask.instruction,
      });
    }
    // if (chosenTask.resource?.audio?.src) {
    //   this.addChatMessage({
    //     isTaskbase: true,
    //     audio: chosenTask.resource?.audio?.src,
    //   });
    // }
    this.chatService.disabled.next(false);
  }

  private removeThinkingMessage() {
    if (
      this.chatMessages[this.chatMessages.length - 1].text ===
      this.thinkingMessage
    ) {
      this.chatMessages = [...this.chatMessages.slice(0, -1)];
    }
  }

  private genericErrorHandler() {
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
  }

  private pickRandomElement<T>(arr: T[]): T {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }
}
