import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { ClozeBit, EssayBit, MultipleChoiceText } from './bitmark.model';

interface RecommendTaskRequest {
  topic: string;
  user_id: string;
}

interface RecommendTaskResponse {
  bitmark: {
    essay: EssayBit;
    cloze: ClozeBit;
    multipleChoiceText: MultipleChoiceText;
  };
}

@Injectable({
  providedIn: 'root',
})
export class RecommenderService {
  readonly topics = ['FOOD_DRINKS', 'WORK', 'PRESENT_SIMPLE'];
  readonly endpoint = 'https://a926-188-155-167-220.eu.ngrok.io/api';

  constructor(private http: HttpClient, private userService: UserService) {}
  recommendTask(topic: string): Observable<RecommendTaskResponse> {
    const user = this.userService.userId;
    const recommendTaskRequest: RecommendTaskRequest = {
      topic,
      user_id: user,
    };
    return this.http.post<RecommendTaskResponse>(
      `${this.endpoint}/task/recommend`,
      recommendTaskRequest
    );
  }
}
