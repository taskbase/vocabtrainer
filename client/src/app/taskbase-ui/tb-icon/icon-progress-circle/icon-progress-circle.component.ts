import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon-progress-circle',
  templateUrl: './icon-progress-circle.component.html',
  styleUrls: ['./icon-progress-circle.component.scss'],
})
export class IconProgressCircleComponent implements OnInit {
  @Input() progress: number = 0; // between 0 and 1
  get percentageString() {
    return `calc(${this.progress * 31.4}px ) 31.4`;
  }

  constructor() {}

  ngOnInit(): void {}
}
