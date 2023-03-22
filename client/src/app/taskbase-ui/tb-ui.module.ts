import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChapterPlayerButtonComponent } from './tb-button/tb-button.component';
import { ChapterPlayerIconModule } from './tb-icon/tb-icon.module';
import { ChapterPlayerLinkListComponent } from './tb-link-list/tb-link-list.component';
import { ChapterPlayerLinkListItemComponent } from './tb-link-list-item/tb-link-list-item.component';
import { RouterModule } from '@angular/router';
import { ChapterPlayerIconComponent } from './tb-icon/tb-icon/tb-icon.component';
import { ChapterPlayerHighlightComponent } from './tb-highlight/tb-highlight.component';
import { ChapterPlayerH3Component } from './typography/tb-h3/tb-h3.component';
import { ChapterPlayerH8Component } from './typography/tb-h8/tb-h8.component';
import { ChapterPlayerText4Component } from './typography/tb-text4/tb-text4.component';
import { ChapterPlayerH5Component } from './typography/tb-h5/tb-h5.component';
import { ChapterPlayerText3Component } from './typography/tb-text3/tb-text3.component';
import { ChapterPlayerText5Component } from './typography/tb-text5/tb-text5.component';
import { ChapterPlayerMailtoComponent } from './tb-mailto/tb-mailto.component';
import { ChapterPlayerLinkComponent } from './tb-link/tb-link.component';

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
