import { Component } from '@angular/core';
import { TbTypographyBaseDirective } from '../tb-typography-base.directive';

@Component({
  selector: 'tb-h3',
  templateUrl: './tb-h3.component.html',
  styleUrls: ['./tb-h3.component.scss'],
})
export class TbH3Component extends TbTypographyBaseDirective {}
