import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { isMobile } from '../../utils';

@Component({
  selector: 'tb-progress-circle',
  templateUrl: './tb-progress-circle.component.html',
  styleUrls: ['./tb-progress-circle.component.scss'],
})
export class TbProgressCircleComponent implements OnInit {
  @Input() progress = 0;
  @Input() icon = '';
  @Input() contentBackground: 'primary' | 'secondary' = 'secondary';
  @Input() contentText: string | null = null;
  @Input() subtitle: string | null = null;

  readonly smallSize = 140;
  readonly largeSize = 164;

  size = this.largeSize;
  stroke = 8;

  center = 0;
  radius = 0;
  arcLength = 0;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.updateSize();
  }

  @HostListener('window:resize', ['$event'])
  updateSize() {
    this.size = isMobile() ? this.smallSize : this.largeSize;
    this.el.nativeElement.style.setProperty(
      '--progress-circle-size',
      `${this.size}px`
    );
    this.el.nativeElement.style.setProperty(
      '--progress-circle-stroke',
      `${this.stroke}px`
    );
    // https://blog.logrocket.com/build-svg-circular-progress-component-react-hooks/
    this.center = this.size / 2;
    this.radius = this.center - this.stroke / 2;
    this.arcLength = 2 * Math.PI * this.radius;
  }

  getArcOffset(): number {
    return this.arcLength * (1 - this.progress / 100);
  }
}
