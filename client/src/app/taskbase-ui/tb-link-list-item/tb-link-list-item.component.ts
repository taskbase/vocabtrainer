import { Component, Input, OnInit } from '@angular/core';

export interface TbLink {
  text: string;
  routerLink: string[];
}

@Component({
  selector: 'tb-link-list-item',
  templateUrl: './tb-link-list-item.component.html',
  styleUrls: ['./tb-link-list-item.component.scss'],
})
export class TbLinkListItemComponent implements OnInit {
  @Input()
  link: TbLink = { text: '', routerLink: [] };

  color = 'black';

  constructor() {}

  ngOnInit(): void {}
}
