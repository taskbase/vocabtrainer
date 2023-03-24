import { Component, EventEmitter, Input } from '@angular/core';

export interface ButtonOptions {
  text: string;
  value: any;
  disabled?: boolean;
}

@Component({
  selector: 'tb-button-options',
  templateUrl: './tb-button-options.component.html',
  styleUrls: ['./tb-button-options.component.scss'],
})
export class TbButtonOptionsComponent {
  @Input() options: ButtonOptions[] = [];
  @Input() fullWidth = false;
  @Input() onClick = new EventEmitter();
}
