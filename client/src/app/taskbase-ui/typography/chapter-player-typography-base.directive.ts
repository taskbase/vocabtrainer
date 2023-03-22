import { Directive, HostBinding, Input, OnInit } from '@angular/core';
import {
  getScssVariable,
  ScssVariable,
} from '../../../scss-variables.generated';

export type ChapterPlayerTextAlign = 'left' | 'center';
export type ChapterPlayerTypographyColor = 'primary' | 'default' | 'white';

@Directive()
export class ChapterPlayerTypographyBaseDirective implements OnInit {
  @Input() color: ChapterPlayerTypographyColor = 'default';

  @HostBinding('style.color')
  get hostColor(): string | null {
    if (this.color === 'primary') {
      return getScssVariable(ScssVariable.COLOR_PRIMARY);
    } else if (this.color === 'white') {
      return 'white';
    } else {
      return null;
    }
  }

  @HostBinding('style.text-align')
  @Input()
  textAlign: 'left' | 'center' | null = null;

  @HostBinding('style.margin-bottom')
  @Input()
  marginBottom: '0' | '8px' | '16px' | '32px' | '64px' | null = null;

  constructor() {}

  ngOnInit(): void {}
}
