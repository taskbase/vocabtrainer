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
  selector: 'app-chapter-player-icon',
  templateUrl: './chapter-player-icon.component.html',
  styleUrls: ['./chapter-player-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChapterPlayerIconComponent implements OnInit {
  @Input() icon: ChapterPlayerIcon | null = null;
  @Input() color: string = 'currentColor';
  @Input() scale: number = 1;

  constructor() {}

  ngOnInit(): void {}
}
