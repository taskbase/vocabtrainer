import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';
import {Chat, Chatbot, ChatResponse} from "./chat-backend.model";

@Injectable({
  providedIn: 'root',
})
export class ChatBackendService {
  readonly endpoint = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {
  }

  getChatbots(): Observable<Chatbot[]> {
    return this.http.get<Chatbot[]>(
      `${this.endpoint}/chat/get-chatbots`
    );
  }

  chat(chat: Chat): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(
      `${this.endpoint}/chat`, chat
    );
  }
}
