import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';
import {Chat, Chatbot, ChatResponse} from "./chatbase.model";

@Injectable({
  providedIn: 'root',
})
export class ChatbaseService {
  readonly endpoint = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {
  }

  getChatbots(): Observable<Chatbot[]> {
    return this.http.get<Chatbot[]>(
      `${this.endpoint}/chatbase/get-chatbots`
    );
  }

  chat(chat: Chat): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(
      `${this.endpoint}/chatbase/chat`, chat
    );
  }
}
