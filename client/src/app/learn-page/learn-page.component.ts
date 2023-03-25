import { Component, OnDestroy, OnInit } from '@angular/core';
import { RecommenderService } from '../recommender.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Bit } from '../bitmark.model';

@Component({
  selector: 'app-learn-page',
  templateUrl: './learn-page.component.html',
  styleUrls: ['./learn-page.component.scss'],
})
export class LearnPageComponent implements OnInit, OnDestroy {
  topic: string = this.recommenderService.topics[0];
  task: Bit | null = null;
  subscriptions: Subscription[] = [];

  constructor(
    private recommenderService: RecommenderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        this.topic = params['topic'];
        this.recommenderService.recommendTask(this.topic).subscribe((task) => {
          this.task = task;
        });
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
