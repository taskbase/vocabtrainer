import { Component, Input, OnInit } from '@angular/core';

type RouterLink = any[] | string | null | undefined;

@Component({
  selector: 'tb-link',
  templateUrl: './tb-link.component.html',
  styleUrls: ['./tb-link.component.scss'],
})
export class ChapterPlayerLinkComponent implements OnInit {
  @Input() link: RouterLink;

  constructor() {}

  ngOnInit(): void {}
}
