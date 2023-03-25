import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { UserService } from './user.service';
import {
  FEEDBACK_CORRECT_MOCK_RESPONSE,
  FEEDBACK_WRONG_MOCK_RESPONSE,
  RECOMMEND_TASK_RESPONSE,
} from './mocks';
import { RecommendTaskRequest, RecommendTaskResponse } from './recommend.model';
import { Bit } from './bitmark.model';

@Injectable({
  providedIn: 'root',
})
export class RecommenderService {
  readonly topics = ['FOOD_DRINKS', 'WORK', 'PRESENT_SIMPLE'];
  readonly endpoint = `https://dfb9-188-155-167-220.eu.ngrok.io` + `/api`;
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

  feedback(bit: Bit): Observable<Bit> {
    return this.http.post<Bit>(`${this.endpoint}/feedback/compute`, bit);
  }

  recommendTaskMock(topic: string): Observable<RecommendTaskResponse> {
    return of(RECOMMEND_TASK_RESPONSE);
  }

  feedbackMockCorrect(bit: Bit): Observable<Bit> {
    return of(FEEDBACK_CORRECT_MOCK_RESPONSE) as any;
  }

  feedbackMockWrong(bit: Bit): Observable<Bit> {
    return of(FEEDBACK_WRONG_MOCK_RESPONSE) as any;
  }

  mastery(): Observable<any> {
    return this.http.post<any>(`${this.endpoint}/mastery`, {});
  }
}
