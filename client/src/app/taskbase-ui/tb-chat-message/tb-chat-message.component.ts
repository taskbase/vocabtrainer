import {Component, Input, SimpleChanges} from '@angular/core';
import {ChatMessage} from '../tb-chat-message-list/tb-chat-message-list.component';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {marked} from "marked";

@Component({
  selector: 'tb-chat-message',
  templateUrl: './tb-chat-message.component.html',
  styleUrls: ['./tb-chat-message.component.scss'],
})
export class TbChatMessageComponent {
  @Input() message: ChatMessage = {
    isTaskbase: true,
    text: 'Default',
  };

  formattedMessage: SafeHtml | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['message'] && this.message.text) {
      const markdown = await marked(this.message.text);
      console.log("markdown: " + markdown);
      this.formattedMessage = this.sanitizer.bypassSecurityTrustHtml(markdown);
    }
  }
}
