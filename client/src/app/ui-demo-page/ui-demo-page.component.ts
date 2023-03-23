import { Component } from '@angular/core';

@Component({
  selector: 'app-ui-demo-page',
  templateUrl: './ui-demo-page.component.html',
  styleUrls: ['./ui-demo-page.component.scss'],
})
export class UiDemoPageComponent {
  chatMessages = [
    {
      isTaskbase: true,
      text: 'Hi I am Amber, your English teacher. I have prepared a learning session of about 10 minutes. Are you ready?',
    },
    {
      isTaskbase: false,
      text: 'Yes',
    },
    {
      isTaskbase: false,
      text: 'Could you please teach me how to say please in English? And please correct me if I am wrong.',
    },
  ];
}
