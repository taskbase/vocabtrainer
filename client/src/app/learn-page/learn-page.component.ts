import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {ChatService} from '../taskbase-ui/chat.service';
import {ChatMessage} from '../taskbase-ui/tb-chat-message-list/tb-chat-message-list.component';
import {
  SERVER_ERRORS,
} from '../mocks';
import {Chat, Chatbot, ChatResponse} from "../chat-backend.model";
import {ChatBackendService} from "../chat-backend.service";

@Component({
  selector: 'app-learn-page',
  templateUrl: './learn-page.component.html',
  styleUrls: ['./learn-page.component.scss'],
})
export class LearnPageComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  chat: Chat | null = null;
  readonly thinkingMessage = `Thinking...`;

  chatMessages: ChatMessage[] = [
    {
      isTaskbase: true,
      text: 'Hi!',
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private chatBackendService: ChatBackendService,
    private chatService: ChatService
  ) {
  }

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        this.chatBackendService.getConfig(params['chatbotId']).subscribe((chatBot: Chatbot) => {
          console.log("chat: " + chatBot)
          this.chat = {
            messages: chatBot?.initial_messages?.map(message => ({content: message, role: "assistant"})) || [],
            chatbotId: params['chatbotId'],
            temperature: 0,
            model: "gpt-4o-mini",
            conversationId: new Date().toISOString(),
            stream: false,
          };
          this.chatMessages = chatBot?.initial_messages?.map(message => ({isTaskbase: true, text: message})) || [];
          this.subscriptions.push(
            this.chatService.messageEvent.subscribe((text: string) => {
              this.handleUserMessage(text);
            })
          );
          }
        )
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
    // add new message to list of messages
    this.chat?.messages.push({"content": text, role: "user"})
    this.addChatMessage({
      isTaskbase: false,
      text,
    });
    this.addThinkingMessage();
    this.chatBackendService.chat(this.chat!!).subscribe({
        next: (response: ChatResponse) => {
          this.chat?.messages.push({"content": response.message, role: "assistant"})
          this.removeThinkingMessage();
          this.addChatMessage({
            isTaskbase: true,
            text: response.message
          })
        }, error: (err) => {
          this.genericErrorHandler()
        }
      }
    )
  }

  private addThinkingMessage() {
    this.addChatMessage({
      isTaskbase: true,
      text: this.thinkingMessage,
    });
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
