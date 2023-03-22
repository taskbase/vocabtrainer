import { Component, Input, OnInit } from '@angular/core';
import { TbLink } from '../tb-link-list-item/tb-link-list-item.component';

@Component({
  selector: 'tb-link-list',
  templateUrl: './tb-link-list.component.html',
  styleUrls: ['./tb-link-list.component.scss'],
})
export class TbLinkListComponent implements OnInit {
  @Input()
  links: TbLink[] = [];

  constructor() {}

  ngOnInit(): void {}

  trackByFn(index: number): number {
    return index;
  }
}
