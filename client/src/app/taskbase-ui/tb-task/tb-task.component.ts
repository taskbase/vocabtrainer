import { Component, Input } from '@angular/core';
import { Bit, EssayBit } from '../../bitmark.model';

@Component({
  selector: 'tb-task',
  templateUrl: './tb-task.component.html',
  styleUrls: ['./tb-task.component.scss'],
})
export class TbTaskComponent {
  @Input() task: Bit | null = null;

  get essayBit() {
    return this.task as EssayBit | null;
  }
}
