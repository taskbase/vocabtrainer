import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTE_BUILDER } from '../routes';

interface DashboardTopic {
  title: string;
  progress: number;
  id: string;
  icon: string;
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  topics: DashboardTopic[] = [
    {
      title: 'Food & Drinks',
      progress: 20,
      id: 'FOOD_DRINKS',
      icon: 'food',
    },
    {
      title: 'Work',
      progress: 80,
      id: 'WORK',
      icon: 'work',
    },
  ];

  constructor(private router: Router) {}
  onClick(topic: DashboardTopic) {
    this.router.navigate(APP_ROUTE_BUILDER.learn(topic.id));
  }
}
