import { Component, Input, OnInit } from '@angular/core';

type RouterLink = any[] | string | null | undefined;

@Component({
  selector: 'app-chapter-player-link',
  templateUrl: './chapter-player-link.component.html',
  styleUrls: ['./chapter-player-link.component.scss'],
})
export class ChapterPlayerLinkComponent implements OnInit {
  @Input() link: RouterLink;

  constructor() {}

  ngOnInit(): void {}
}
