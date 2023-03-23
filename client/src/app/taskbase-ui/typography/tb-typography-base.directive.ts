import { Directive, HostBinding, Input, OnInit } from '@angular/core';
import { getScssVariable, ScssVariable } from '../../scss-variables.generated';

export type TbTypographyColor = 'primary' | 'default' | 'white';

@Directive()
export class TbTypographyBaseDirective implements OnInit {
  @Input() color: TbTypographyColor = 'default';

  @HostBinding('style.color')
  get hostColor(): string | null {
    if (this.color === 'primary') {
      return '#5d62c7';
    } else if (this.color === 'white') {
      return 'white';
    } else {
      return null;
    }
  }

  @HostBinding('style.font-family')
  fontFamily: string = getScssVariable(ScssVariable.TB_FONT_PRIMARY);

  @HostBinding('style.text-align')
  @Input()
  textAlign: 'left' | 'center' | null = null;

  @HostBinding('style.margin-bottom')
  @Input()
  marginBottom: '0' | '8px' | '16px' | '32px' | '48px' | '64px' | null = null;

  constructor() {}

  ngOnInit(): void {}
}
