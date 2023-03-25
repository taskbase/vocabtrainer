import { Component, OnDestroy, OnInit } from '@angular/core';
import { RecommenderService } from '../recommender.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Bit } from '../bitmark.model';
import { ChatService } from '../taskbase-ui/chat.service';

@Component({
  selector: 'app-learn-page',
  templateUrl: './learn-page.component.html',
  styleUrls: ['./learn-page.component.scss'],
})
export class LearnPageComponent implements OnInit, OnDestroy {
  topic: string = this.recommenderService.topics[0];
  task: Bit | null = null;
  subscriptions: Subscription[] = [];

  chatMessages = [
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

  private addChatMessage(chatMessage: { isTaskbase: boolean; text: string }) {
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
      this.recommenderService.recommendTask(this.topic).subscribe((task) => {
        taskReceived = true;
        this.task = task;
        this.chatService.disabled.next(false);
      });

      // add a temporary thinking message...
      setTimeout(() => {
        if (!taskReceived) {
          this.addChatMessage({
            isTaskbase: true,
            text: 'Thinking...',
          });
        }
      }, 200);
    }
  }
}
