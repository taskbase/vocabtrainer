import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chapter-player-mailto',
  templateUrl: './chapter-player-mailto.component.html',
  styleUrls: ['./chapter-player-mailto.component.scss'],
})
export class ChapterPlayerMailtoComponent implements OnInit {
  @Input() mail: string;

  constructor() {}

  ngOnInit(): void {}

  get mailtoLink() {
    return `mailto:${this.mail}`;
  }
}
