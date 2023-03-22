import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TbIcon } from '../tb-icon/tb-icon/tb-icon.component';

interface ButtonProperties {
  iconScale: number;
}

export type TbButtonCategory = 'filled' | 'outline' | 'ghost';
export type TbButtonSize = 'large' | 'medium' | 'small' | 'tiny';
export type TbIconPosition = 'left' | 'right' | 'fab'; // fab is an icon only button

@Component({
  selector: 'tb-button',
  templateUrl: './tb-button.component.html',
  styleUrls: ['./tb-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TbButtonComponent implements OnInit {
  @Input() type: TbButtonCategory = 'filled';
  @Input() size: TbButtonSize = 'medium';
  @Input() icon: TbIcon | null = null; // TODO #3258: improve alignment
  @Input() iconPosition: TbIconPosition = 'right';
  @Input() disabled = false;
  @Input() invert = false; // TODO #3257: make inverted work

  @ViewChild('contentWrapper') content: ElementRef | null = null;

  get buttonProps(): ButtonProperties {
    const iconScale = this.size === 'tiny' ? 2 / 3 : 1;
    return {
      iconScale,
    };
  }

  constructor() {}

  ngOnInit(): void {}
}
