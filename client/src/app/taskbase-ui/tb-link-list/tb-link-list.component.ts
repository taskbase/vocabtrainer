import { Component, Input, OnInit } from '@angular/core';
import { ChapterPlayerLink } from '../tb-link-list-item/chapter-player-link-list-item.component';

@Component({
  selector: 'app-chapter-player-link-list',
  templateUrl: './chapter-player-link-list.component.html',
  styleUrls: ['./chapter-player-link-list.component.scss'],
})
export class ChapterPlayerLinkListComponent implements OnInit {
  @Input()
  links: ChapterPlayerLink[] = [];

  constructor() {}

  ngOnInit(): void {}

  trackByFn(index: number): number {
    return index;
  }
}
