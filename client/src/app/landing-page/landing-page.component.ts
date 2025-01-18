import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {APP_ROUTE_BUILDER} from '../routes';
import {ChatbaseService} from "../chatbase.service";
import {Chatbot} from "../chatbase.model";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  chatbots: Chatbot[] = [];

  ngOnInit() {
    this.chatbaseService.getChatbots().subscribe((value: Chatbot[]) => {
      this.chatbots = value
    });
  }

  constructor(
    private router: Router,
    private chatbaseService: ChatbaseService
  ) {
  }

  onClick(chatbot: Chatbot) {
    this.router.navigate(APP_ROUTE_BUILDER.learn(chatbot.id));
  }
}
