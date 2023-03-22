import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tb-mailto',
  templateUrl: './tb-mailto.component.html',
  styleUrls: ['./tb-mailto.component.scss'],
})
export class TbMailtoComponent implements OnInit {
  @Input() mail: string = '';

  constructor() {}

  ngOnInit(): void {}

  get mailtoLink() {
    return `mailto:${this.mail}`;
  }
}
