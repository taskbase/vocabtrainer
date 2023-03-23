import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TbButtonComponent } from './tb-button/tb-button.component';
import { TbIconModule } from './tb-icon/tb-icon.module';
import { TbLinkListComponent } from './tb-link-list/tb-link-list.component';
import { RouterModule } from '@angular/router';
import { TbIconComponent } from './tb-icon/tb-icon/tb-icon.component';
import { TbHighlightComponent } from './tb-highlight/tb-highlight.component';
import { TbH3Component } from './typography/tb-h3/tb-h3.component';
import { TbH8Component } from './typography/tb-h8/tb-h8.component';
import { TbText4Component } from './typography/tb-text4/tb-text4.component';
import { TbH5Component } from './typography/tb-h5/tb-h5.component';
import { TbText3Component } from './typography/tb-text3/tb-text3.component';
import { TbText5Component } from './typography/tb-text5/tb-text5.component';
import { TbMailtoComponent } from './tb-mailto/tb-mailto.component';
import { TbLinkComponent } from './tb-link/tb-link.component';
import { TbLinkListItemComponent } from './tb-link-list-item/tb-link-list-item.component';
import { TbChatMessageComponent } from './tb-chat-message/tb-chat-message.component';

@NgModule({
  declarations: [
    TbButtonComponent,
    TbLinkListComponent,
    TbHighlightComponent,
    TbH3Component,
    TbH5Component,
    TbH8Component,
    TbText3Component,
    TbText4Component,
    TbText5Component,
    TbMailtoComponent,
    TbLinkComponent,
    TbLinkListItemComponent,
  ],
  imports: [CommonModule, TbIconModule, RouterModule, TbChatMessageComponent],
  exports: [
    TbButtonComponent,
    TbLinkListComponent,
    TbIconComponent,
    TbHighlightComponent,
    TbH3Component,
    TbH5Component,
    TbH8Component,
    TbText3Component,
    TbText4Component,
    TbText5Component,
    TbMailtoComponent,
    TbLinkComponent,
    TbChatMessageComponent,
  ],
})
export class TbUiModule {}
