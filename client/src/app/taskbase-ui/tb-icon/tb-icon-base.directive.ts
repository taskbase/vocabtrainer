import { Directive, Input, OnInit } from '@angular/core';

@Directive()
export class ChapterPlayerIconBaseDirective implements OnInit {
  @Input() color: string = 'currentColor';
  @Input() scale: number = 1;

  constructor() {}

  ngOnInit(): void {}
}
