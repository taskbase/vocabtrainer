import { Component } from '@angular/core';
import { ChapterPlayerIconBaseDirective } from '../chapter-player-icon-base.directive';

@Component({
  selector: 'app-icon-hamburger',
  templateUrl: './icon-hamburger.component.html',
  styleUrls: ['./icon-hamburger.component.scss'],
})
export class IconHamburgerComponent extends ChapterPlayerIconBaseDirective {}
