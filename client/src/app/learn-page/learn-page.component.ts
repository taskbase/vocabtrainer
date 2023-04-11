import { Component, OnDestroy, OnInit } from '@angular/core';
import { RecommenderService } from '../recommender.service';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, forkJoin, Subscription } from 'rxjs';
import {
  Bit,
  ClozeBit,
  ClozeBitBodyGap,
  EssayBit,
  FeedbackItem,
} from '../bitmark.model';
import { ChatService } from '../taskbase-ui/chat.service';
import { ChatMessage } from '../taskbase-ui/tb-chat-message-list/tb-chat-message-list.component';
import { RecommendTaskResponse } from '../recommend.model';
import {
  FINISHED_MESSAGES,
  MISTAKE_MESSAGES,
  SERVER_ERRORS,
  SUCCESS_MESSAGES,
} from '../mocks';

enum ChatState {
  INITIAL = 'INITIAL',
  USER_READY = 'USER_READY',
  DIFFICULTY4 = 'DIFFICULTY4',
  DIFFICULTY3 = 'DIFFICULTY3',
  DIFFICULTY2 = 'DIFFICULTY2',
  DIFFICULTY1 = 'DIFFICULTY1',
  FINISHED = 'FINISHED',
}

enum TaskType {
  ESSAY = 'ESSAY',
  AUDIO = 'AUDIO',
  CLOZE = 'CLOZE',
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

  solvedTasksCounter = 0;

  state: ChatState = ChatState.INITIAL;

  chatMessages: ChatMessage[] = [
    {
      isTaskbase: true,
      text: 'Hi! I am Amber, your English teacher. I have prepared a learning session of about 3 minutes. Are you ready?',
    },
  ];

  readonly taskLimit = 2;

  constructor(
    private recommenderService: RecommenderService,
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        this.topic = params['topic'];
        this.subscriptions.push(
          this.chatService.messageEvent.subscribe((text: string) => {
            this.handleUserMessage(text);
          })
        );
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private addChatMessage(chatMessage: ChatMessage) {
    this.chatMessages = [...this.chatMessages, chatMessage];
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 0);
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
        this.handleAttempt(text, TaskType.ESSAY);
      },
      [ChatState.DIFFICULTY3]: () => {
        this.handleAttempt(text, TaskType.AUDIO);
      },
      [ChatState.DIFFICULTY2]: () => {
        this.handleAttempt(text, TaskType.CLOZE);
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

  private handleAttempt(text: string, type: TaskType) {
    const typeHandlers: Record<TaskType, () => void> = {
      [TaskType.ESSAY]: () =>
        ((this.currentTask as EssayBit).answer.text = text),
      [TaskType.AUDIO]: () => {
        (this.currentTask as EssayBit).answer.text = text;
        (this.currentTask as EssayBit).feedbackEngine.feedbackId += `-audio`;
      },
      [TaskType.CLOZE]: () => {
        // Assumption: there is only one gap. This is satisfied by tasks from the taskpool.
        const gap = (this.currentTask as ClozeBit).body.find(
          (elt) => elt.type === 'gap'
        );
        (gap as any).answer.text = text;
      },
    };
    typeHandlers[type]();

    this.addThinkingMessage();
    forkJoin([
      this.recommenderService.offTopicFilter(text),
      this.recommenderService.feedback(this.currentTask as Bit),
    ]).subscribe({
      next: ([offTopic, bit]: [any, any]) => {
        this.removeThinkingMessage();
        if (offTopic.length > 0) {
          this.addChatMessage({
            isTaskbase: true,
            text: offTopic[0].message,
          });
          this.addChatMessage({
            isTaskbase: true,
            text: "Let's try one more time!",
          });
        } else {
          const feedback = bit.feedback as FeedbackItem[];

          let allFeedbacks: FeedbackItem[] = [...feedback];

          if (type === TaskType.CLOZE) {
            // the cloze tasks also have feedback on the gaps
            const clozeBit: ClozeBit = bit;
            const feedbacks: FeedbackItem[] = clozeBit.body
              .filter((item) => item.type === 'gap')
              .flatMap((item) => (item as ClozeBitBodyGap).feedback);
            allFeedbacks = [...allFeedbacks, ...feedbacks];
          }

          const wrongFeedbacks = allFeedbacks.filter(
            (item) => item.correctness !== 'CORRECT'
          );
          const isCorrect = wrongFeedbacks.length === 0;

          if (isCorrect) {
            this.recommenderService.adjustMastery(
              this.topic as 'FOOD_DRINKS' | 'WORK'
            );
            this.handleGoNext();
          } else {
            this.handleWrongAttempt(
              this.extractFeedbackMessage(wrongFeedbacks)
            );
          }
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
        text: this.pickRandomElement(SUCCESS_MESSAGES),
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

  /**
   * Extract the feedback message if it's usable, otherwise come up with something.
   * */
  private extractFeedbackMessage(feedbackList: FeedbackItem[]): string {
    const maybeGoodFeedback = feedbackList.find(
      (item) =>
        !item.message.includes('sample solution') &&
        !item.message.includes('keyword')
    );

    if (maybeGoodFeedback) {
      return maybeGoodFeedback.message;
    } else {
      return this.pickRandomElement(MISTAKE_MESSAGES);
    }
  }

  private handleWrongAttempt(feedbackMessage: string) {
    this.addChatMessage({
      isTaskbase: true,
      text: feedbackMessage,
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
        text: `Let me help you out here. Fill in the gap.`,
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

    const currentTask = this.currentResponse;
    const doFetch = (counter: number) => {
      this.recommenderService.recommendTask(this.topic).subscribe({
        error: () => {
          this.genericErrorHandler();
        },
        next: (task) => {
          const isExcluded =
            task.bitmark.essay.instruction ===
              currentTask?.bitmark.essay.instruction ||
            task.bitmark.essay.sampleSolution.includes(
              'He ordered one dinner'
            ) ||
            task.bitmark.essay.sampleSolution.includes('Fruit');
          if (isExcluded) {
            if (counter < 2) {
              doFetch(counter++);
            }
          } else {
            this.removeThinkingMessage();
            this.handleTaskReceived(task);
          }
        },
      });
    };
    doFetch(0);
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
      text: this.pickRandomElement(SERVER_ERRORS),
    });
    this.removeThinkingMessage();
    this.chatService.disabled.next(false);
  }

  private pickRandomElement<T>(arr: T[]): T {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }
}
