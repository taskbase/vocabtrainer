import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChapterPlayerIcon } from '../tb-icon/tb-icon/tb-icon.component';

interface ButtonProperties {
  iconScale: number;
}

export type ChapterPlayerButtonCategory = 'filled' | 'outline' | 'ghost';
export type ChapterPlayerButtonSize = 'large' | 'medium' | 'small' | 'tiny';
export type ChapterPlayerIconPosition = 'left' | 'right' | 'fab'; // fab is an icon only button

@Component({
  selector: 'tb-button',
  templateUrl: './tb-button.component.html',
  styleUrls: ['./tb-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChapterPlayerButtonComponent implements OnInit {
  @Input() type: ChapterPlayerButtonCategory = 'filled';
  @Input() size: ChapterPlayerButtonSize = 'medium';
  @Input() icon: ChapterPlayerIcon | null = null; // TODO #3258: improve alignment
  @Input() iconPosition: ChapterPlayerIconPosition = 'right';
  @Input() disabled = false;
  @Input() invert = false; // TODO #3257: make inverted work

  @ViewChild('contentWrapper') content: ElementRef;

  get buttonProps(): ButtonProperties {
    const iconScale = this.size === 'tiny' ? 2 / 3 : 1;
    return {
      iconScale,
    };
  }

  constructor() {}

  ngOnInit(): void {}
}
