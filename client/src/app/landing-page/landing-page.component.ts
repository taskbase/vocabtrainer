import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {APP_ROUTE_BUILDER} from '../routes';
import {ChatBackendService} from "../chat-backend.service";
import {Chatbot} from "../chat-backend.model";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  chatbots: Chatbot[] = [];
  icons: string[] = [
    "assets/img/icons/food.svg",
    "assets/img/icons/misc.svg",
    "assets/img/icons/work.svg",
  ]

  ngOnInit() {
    this.chatbaseService.getChatbots().subscribe((value: Chatbot[]) => {
      this.chatbots = value
    });
  }

  constructor(
    private router: Router,
    private chatbaseService: ChatBackendService
  ) {
  }

  onClick(chatbot: Chatbot) {
    this.router.navigate(APP_ROUTE_BUILDER.learn(chatbot.id));
  }

  getIcon(chatbot: Chatbot): string {
    // Choose a pseudo random icon
    let randomNumber = chatbot.name.length > 0 ? chatbot.name.charCodeAt(0) : 0
    return this.icons[randomNumber % this.icons.length];
  }
}
