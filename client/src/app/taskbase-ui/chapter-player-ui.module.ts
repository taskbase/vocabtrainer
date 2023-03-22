import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChapterPlayerButtonComponent } from './tb-button/chapter-player-button.component';
import { ChapterPlayerIconModule } from './tb-icon/chapter-player-icon.module';
import { ChapterPlayerLinkListComponent } from './tb-link-list/chapter-player-link-list.component';
import { ChapterPlayerLinkListItemComponent } from './tb-link-list-item/chapter-player-link-list-item.component';
import { RouterModule } from '@angular/router';
import { ChapterPlayerIconComponent } from './tb-icon/chapter-player-icon/chapter-player-icon.component';
import { ChapterPlayerHighlightComponent } from './tb-highlight/chapter-player-highlight.component';
import { ChapterPlayerH3Component } from './typography/tb-h3/chapter-player-h3.component';
import { ChapterPlayerH8Component } from './typography/tb-h8/chapter-player-h8.component';
import { ChapterPlayerText4Component } from './typography/tb-text4/chapter-player-text4.component';
import { ChapterPlayerH5Component } from './typography/tb-h5/chapter-player-h5.component';
import { ChapterPlayerText3Component } from './typography/tb-text3/chapter-player-text3.component';
import { ChapterPlayerText5Component } from './typography/tb-text5/chapter-player-text5.component';
import { ChapterPlayerMailtoComponent } from './tb-mailto/chapter-player-mailto.component';
import { ChapterPlayerLinkComponent } from './tb-link/chapter-player-link.component';

@NgModule({
  declarations: [
    ChapterPlayerButtonComponent,
    ChapterPlayerLinkListComponent,
    ChapterPlayerLinkListItemComponent,
    ChapterPlayerHighlightComponent,
    ChapterPlayerH3Component,
    ChapterPlayerH5Component,
    ChapterPlayerH8Component,
    ChapterPlayerText3Component,
    ChapterPlayerText4Component,
    ChapterPlayerText5Component,
    ChapterPlayerMailtoComponent,
    ChapterPlayerLinkComponent,
  ],
  imports: [CommonModule, ChapterPlayerIconModule, RouterModule],
  exports: [
    ChapterPlayerButtonComponent,
    ChapterPlayerLinkListComponent,
    ChapterPlayerIconComponent,
    ChapterPlayerHighlightComponent,
    ChapterPlayerH3Component,
    ChapterPlayerH5Component,
    ChapterPlayerH8Component,
    ChapterPlayerText3Component,
    ChapterPlayerText4Component,
    ChapterPlayerText5Component,
    ChapterPlayerMailtoComponent,
    ChapterPlayerLinkComponent,
  ],
})
export class ChapterPlayerUiModule {}
