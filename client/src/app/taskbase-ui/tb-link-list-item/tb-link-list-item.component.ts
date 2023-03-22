import { Component, Input, OnInit } from '@angular/core';
import {
  getScssVariable,
  ScssVariable,
} from '../../../scss-variables.generated';

export interface ChapterPlayerLink {
  text: string;
  routerLink: string[];
}

@Component({
  selector: 'tb-link-list-item',
  templateUrl: './tb-link-list-item.component.html',
  styleUrls: ['./tb-link-list-item.component.scss'],
})
export class ChapterPlayerLinkListItemComponent implements OnInit {
  @Input()
  link: ChapterPlayerLink;

  color = getScssVariable(ScssVariable.COLOR_PRIMARY);

  constructor() {}

  ngOnInit(): void {}
}
