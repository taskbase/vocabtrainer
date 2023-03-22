import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

export type TbIcon =
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
export class TbIconComponent implements OnInit {
  @Input() icon: TbIcon | null = null;
  @Input() color: string = 'currentColor';
  @Input() scale: number = 1;

  constructor() {}

  ngOnInit(): void {}
}
