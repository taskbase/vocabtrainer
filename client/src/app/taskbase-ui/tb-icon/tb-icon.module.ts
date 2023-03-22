import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconCaretRightComponent } from './icon-caret-right/icon-caret-right.component';
import { ChapterPlayerIconComponent } from './chapter-player-icon/chapter-player-icon.component';
import { IconRightArrowComponent } from './icon-right-arrow/icon-right-arrow.component';
import { IconQuestionMarkComponent } from './icon-question-mark/icon-question-mark.component';
import { IconHamburgerComponent } from './icon-hamburger/icon-hamburger.component';
import { IconLeftArrowComponent } from './icon-left-arrow/icon-left-arrow.component';
import { IconHexagonComponent } from './icon-hexagon/icon-hexagon.component';
import { IconFileDownloadComponent } from './icon-file-download/icon-file-download.component';
import { IconProgressCircleComponent } from './icon-progress-circle/icon-progress-circle.component';

@NgModule({
  declarations: [
    IconCaretRightComponent,
    ChapterPlayerIconComponent,
    IconRightArrowComponent,
    IconQuestionMarkComponent,
    IconHamburgerComponent,
    IconLeftArrowComponent,
    IconHexagonComponent,
    IconFileDownloadComponent,
    IconProgressCircleComponent,
  ],
  imports: [CommonModule],
  exports: [
    ChapterPlayerIconComponent,
    IconProgressCircleComponent,
    IconHexagonComponent,
  ],
})
export class ChapterPlayerIconModule {}
