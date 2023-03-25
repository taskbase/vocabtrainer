import { Component, Input } from '@angular/core';
import { EssayBit } from '../../../bitmark.model';

@Component({
  selector: 'tb-essay-task',
  templateUrl: './tb-essay-task.component.html',
  styleUrls: ['./tb-essay-task.component.scss'],
})
export class TbEssayTaskComponent {
  @Input() task: EssayBit | null = null;
}
