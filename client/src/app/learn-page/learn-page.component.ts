import { Component, OnDestroy, OnInit } from '@angular/core';
import { RecommenderService } from '../recommender.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Bit, BitType, ClozeBit, EssayBit } from '../bitmark.model';
import { ChatService } from '../taskbase-ui/chat.service';
import { hackathonScript } from '../chat-hackathon-script';
import { ChatMessage } from '../taskbase-ui/tb-chat-message-list/tb-chat-message-list.component';
import { RecommendTaskResponse } from '../recommend.model';
import { FINISHED_MESSAGES, SUCCESS_MESSAGES } from '../mocks';

enum ChatState {
  INITIAL = 'INITIAL',
  USER_READY = 'USER_READY',
  DIFFICULTY4 = 'DIFFICULTY4',
  DIFFICULTY3 = 'DIFFICULTY3',
  DIFFICULTY2 = 'DIFFICULTY2',
  DIFFICULTY1 = 'DIFFICULTY1',
  FINISHED = 'FINISHED',
}

@Component({
  selector: 'app-learn-page',
  templateUrl: './learn-page.component.html',
  styleUrls: ['./learn-page.component.scss'],
})
export class LearnPageComponent implements OnInit, OnDestroy {
  topic: string = this.recommenderService.topics[0];
  currentTask: Bit | null = null;
  currentResponse: RecommendTaskResponse | null = null;
  subscriptions: Subscription[] = [];
  readonly thinkingMessage = `Thinking...`;

  readonly successMessages = SUCCESS_MESSAGES;

  solvedTasksCounter = 0;

  state: ChatState = ChatState.INITIAL;

  chatMessages: ChatMessage[] = [
    {
      isTaskbase: true,
      text: 'Hi! I am Amber, your English teacher. I have prepared a learning session of about 10 minutes. Are you ready?',
    },
  ];

  private scriptProgress: number = 0;
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

        if (this.topic == 'ASSISTANT') {
          this.handleAssistant();
        } else {
          this.subscriptions.push(
            this.chatService.messageEvent.subscribe((text: string) => {
              this.handleUserMessage(text);
            })
          );
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private handleAssistant() {
    // Follow a scripted interaction for the hackathon
    this.chatMessages = [];
    this.scriptProgress = 0;
    this.chatService.messageEvent.subscribe((text) => {
      this.addChatMessage({
        isTaskbase: false,
        text: text,
      });
      setTimeout(() => this.advanceScript(), 1000);
    });
    this.advanceScript();
  }

  private addChatMessage(chatMessage: ChatMessage) {
    this.chatMessages = [...this.chatMessages, chatMessage];
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 0);
  }

  private advanceScript() {
    const [scriptElement, action] = hackathonScript[this.scriptProgress];

    this.addChatMessage({
      isTaskbase: true,
      text: scriptElement,
    });

    // TODO: add some types and don't give different meanings to null and undefined
    if (action === null) {
      // Wait for user input
      this.chatService.disabled.next(false);
    } else if (typeof action === 'number') {
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

      this.checkStateMachine(text);
    }
  }

  private checkStateMachine(text: string) {
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
        this.handleAttempt(text, 'essay');
      },
      [ChatState.DIFFICULTY3]: () => {
        this.handleAttempt(text, 'essay-audio');
      },
      [ChatState.DIFFICULTY2]: () => {
        this.handleAttempt(text, 'cloze');
      },
      [ChatState.DIFFICULTY1]: () => {
        this.addChatMessage({
          isTaskbase: true,
          text: `Let's try another task.`,
        });
        this.handleGoNext(false);
      },
      [ChatState.FINISHED]: () => {
        this.addChatMessage({
          isTaskbase: true,
          text: this.pickRandomElement(FINISHED_MESSAGES),
        });
      },
    };
    handlers[this.state]();
  }

  private handleAttempt(text: string, type: string) {
    if (type === 'essay') {
      (this.currentTask as EssayBit).answer.text = text;
    } else if (type === 'essay-audio') {
      (this.currentTask as EssayBit).answer.text = text;
      (this.currentTask as EssayBit).feedbackEngine.feedbackId += `-audio`;
    } else if (type === 'cloze') {
      // Assumption: there is only one gap. This is satisfied by tasks from the taskpool.
      const gap = (this.currentTask as ClozeBit).body.find(
        (elt) => elt.type === 'gap'
      );
      (gap as any).answer.text = text;
    } else {
      // NEVER
      console.error('you are not here. NO!');
    }
    this.addThinkingMessage();
    this.recommenderService
      .feedbackMockCorrect(this.currentTask as Bit)
      .subscribe({
        next: (bit: any) => {
          this.removeThinkingMessage();
          const isCorrect = bit.feedback.every(
            (feedback: any) => feedback.correctness === 'CORRECT'
          );
          if (isCorrect) {
            this.handleGoNext();
          } else {
            this.handleWrongAttempt(bit);
          }
        },
        error: () => {
          this.genericErrorHandler();
        },
      });
  }

  private handleGoNext(wasCorrect: boolean = true) {
    this.solvedTasksCounter++;
    this.state = ChatState.DIFFICULTY4;
    if (wasCorrect) {
      this.addChatMessage({
        isTaskbase: true,
        text: this.pickRandomElement(this.successMessages),
      });
    }
    if (this.solvedTasksCounter < this.taskLimit) {
      this.fetchNextTask();
    } else {
      this.state = ChatState.FINISHED;
      this.addChatMessage({
        isTaskbase: true,
        text: `You've completed all ${this.taskLimit} tasks. Woohoo! Go back to the dashboard to check your mastery.`,
      });
    }
  }

  private handleWrongAttempt(bit: any) {
    const firstFeedback = bit.feedback[0];
    this.addChatMessage({
      isTaskbase: true,
      text: firstFeedback.message,
    });
    if (this.state === ChatState.DIFFICULTY4) {
      this.state = ChatState.DIFFICULTY3;
      this.addChatMessage({
        isTaskbase: true,
        text: `Almost there. Here's an audio, maybe this helps.`,
      });
      this.addChatMessage({
        isTaskbase: true,
        audio: (this.currentTask as EssayBit).resource?.audio.src,
      });
    } else if (this.state === ChatState.DIFFICULTY3) {
      this.state = ChatState.DIFFICULTY2;
      this.addChatMessage({
        isTaskbase: true,
        text: `Let me help you out here. Just give me the missing word.`,
      });
      const clozeBit = this.currentResponse?.bitmark.cloze as ClozeBit;
      this.currentTask = clozeBit;

      // only add the body, the instruction is useless.
      this.addChatMessage({
        isTaskbase: true,
        text: clozeBit.body
          .map((elt) => {
            if (elt.type === 'text') {
              return (elt as any).text;
            } else {
              return `________`;
            }
          })
          .join(''),
      });
    } else if (this.state === ChatState.DIFFICULTY2) {
      this.state = ChatState.DIFFICULTY1;
      this.checkStateMachine('');
    }
  }

  private fetchNextTask() {
    // disable input field until complete
    this.chatService.disabled.next(true);

    this.addThinkingMessage();

    this.recommenderService.recommendTaskMock(this.topic).subscribe({
      error: () => {
        this.genericErrorHandler();
      },
      next: (task) => {
        this.removeThinkingMessage();
        this.handleTaskReceived(task);
      },
    });
  }

  private addThinkingMessage() {
    this.addChatMessage({
      isTaskbase: true,
      text: this.thinkingMessage,
    });
  }

  private handleTaskReceived(response: RecommendTaskResponse) {
    this.state = ChatState.DIFFICULTY4;
    this.currentResponse = response;
    const chosenTask = response.bitmark.essay;
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
    this.removeThinkingMessage();
    this.chatService.disabled.next(false);
  }

  private pickRandomElement<T>(arr: T[]): T {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }
}
