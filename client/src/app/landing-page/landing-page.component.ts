import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTE_BUILDER } from '../routes';
import { RecommenderService } from '../recommender.service';

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
export class LandingPageComponent implements OnInit {
  topics: DashboardTopic[] = [
    {
      title: 'Food & Drinks',
      progress: 0,
      id: 'FOOD_DRINKS',
      icon: 'food',
    },
    {
      title: 'Work',
      progress: 0,
      id: 'WORK',
      icon: 'work',
    },
  ];

  ngOnInit() {
    this.recommenderService.mastery().subscribe((result) => {
      this.topics.forEach((topic) => {
        const progress = Math.trunc(result[topic.id] * 100);
        const numSteps = 100;

        let counter = 0;
        function stepUp() {
          setTimeout(() => {
            topic.progress = Math.trunc((progress * counter) / numSteps);
            if (counter++ < numSteps) {
              stepUp();
            }
          }, 1);
        }
        stepUp();
      });
    });
  }

  constructor(
    private router: Router,
    private recommenderService: RecommenderService
  ) {}

  onClick(topic: DashboardTopic) {
    this.router.navigate(APP_ROUTE_BUILDER.learn(topic.id));
  }
}
