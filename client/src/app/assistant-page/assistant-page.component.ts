import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatMessage } from '../taskbase-ui/tb-chat-message-list/tb-chat-message-list.component';
import { ChatService } from '../taskbase-ui/chat.service';
import { Subscription } from 'rxjs';

enum AssistantState {
  'TASKBASE_MESSAGE' = 'TASKBASE_MESSAGE',
  'USER_MESSAGE' = 'USER_MESSAGE',
  'END' = 'END',
}

interface AssistantItem {
  message: string;
  delaySeconds: number;
  nextState: AssistantState;
}

export const hackathonScript: AssistantItem[] = [
  {
    message:
      'Hi! I am Taskbot, your personal learning assistant. What would you like to learn today?',
    delaySeconds: 0,
    nextState: AssistantState.USER_MESSAGE,
  },
  {
    message: 'Cool, that sounds interesting.',
    delaySeconds: 1,
    nextState: AssistantState.TASKBASE_MESSAGE,
  },
  {
    message:
      "Give me a moment, I'm making a personalized learning plan just for you...",
    delaySeconds: 3,
    nextState: AssistantState.TASKBASE_MESSAGE,
  },
  {
    message: "Okay, here's today's study plan:",
    delaySeconds: 1,
    nextState: AssistantState.TASKBASE_MESSAGE,
  },
  {
    message:
      'You need to improve your math skills to calculate derivatives. You need to understand gradient descent. You also need to have basic Python programming skills.',
    delaySeconds: 1,
    nextState: AssistantState.TASKBASE_MESSAGE,
  },
  {
    message: 'All this will take about 2 hours to learn.',
    delaySeconds: 1,
    nextState: AssistantState.TASKBASE_MESSAGE,
  },
  {
    message: 'Ready to go?',
    delaySeconds: 0,
    nextState: AssistantState.USER_MESSAGE,
  },
  {
    message: "Perfect! Let's start.",
    delaySeconds: 1,
    nextState: AssistantState.TASKBASE_MESSAGE,
  },
  {
    message: "We'll start with math.",
    delaySeconds: 1,
    nextState: AssistantState.TASKBASE_MESSAGE,
  },
  {
    message:
      "First, let's learn the constant rule. It says that the derivative of c times x equals c times the derivative of x, where c is a constant (not dependent on x). The derivative of x is always 1. What is the derivative of 5x?",
    delaySeconds: 0,
    nextState: AssistantState.TASKBASE_MESSAGE,
  },
  {
    message: '[Several math tasks later...]',
    delaySeconds: 3,
    nextState: AssistantState.TASKBASE_MESSAGE,
  },
  {
    message: "Now we'll switch to some coding. Are you ready?",
    delaySeconds: 0,
    nextState: AssistantState.USER_MESSAGE,
  },
  {
    message: '[Several programming tasks later...]',
    delaySeconds: 3,
    nextState: AssistantState.TASKBASE_MESSAGE,
  },
  {
    message:
      "That's it! You're all set to learn how to make your own neural network. Is there anything else you want to learn today?",
    delaySeconds: 0,
    nextState: AssistantState.USER_MESSAGE,
  },
  {
    message: 'OK, then have a great day!',
    delaySeconds: 0,
    nextState: AssistantState.END,
  },
];

@Component({
  selector: 'app-assistant-page',
  templateUrl: './assistant-page.component.html',
  styleUrls: ['./assistant-page.component.scss'],
})
export class AssistantPageComponent implements OnInit, OnDestroy {
  chatMessages: ChatMessage[] = [];
  scriptProgress = 0;
  subscriptions: Subscription[] = [];

  constructor(private chatService: ChatService) {}
  ngOnInit() {
    // Follow a scripted interaction for the hackathon
    this.subscriptions.push(
      this.chatService.messageEvent.subscribe((text) => {
        this.addChatMessage({
          isTaskbase: false,
          text: text,
        });
        setTimeout(() => this.advanceScript(), 1000);
      })
    );
    this.advanceScript();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private advanceScript() {
    const item = hackathonScript[this.scriptProgress];
    this.scriptProgress++;

    this.addChatMessage({
      isTaskbase: true,
      text: item.message,
    });

    this.chatService.disabled.next(true);

    const nextItemHandlers: Record<AssistantState, () => void> = {
      [AssistantState.USER_MESSAGE]: () => {
        this.chatService.disabled.next(false);
      },
      [AssistantState.TASKBASE_MESSAGE]: () => {
        setTimeout(() => this.advanceScript(), item.delaySeconds * 1000);
      },
      [AssistantState.END]: () => {
        // end the chat
        this.chatService.disabled.next(true);
      },
    };
    nextItemHandlers[item.nextState]();
  }

  private addChatMessage(chatMessage: ChatMessage) {
    this.chatMessages = [...this.chatMessages, chatMessage];
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 0);
  }
}
