import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  messageEvent = new Subject<string>();

  clear = new Subject<void>();
  disabled = new Subject<boolean>();

  constructor() {}
}
