import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

export type ChapterPlayerIcon =
  | 'caret-right'
  | 'right-arrow'
  | 'left-arrow'
  | 'question-mark'
  | 'hamburger'
  | 'hexagon'
  | 'file-download';

@Component({
  selector: 'tb-icon',
  templateUrl: './tb-icon.component.html',
  styleUrls: ['./tb-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChapterPlayerIconComponent implements OnInit {
  @Input() icon: ChapterPlayerIcon | null = null;
  @Input() color: string = 'currentColor';
  @Input() scale: number = 1;

  constructor() {}

  ngOnInit(): void {}
}
