import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { UserService } from './user.service';
import { Bit } from './bitmark.model';

interface RecommendTask {
  topic: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class RecommenderService {
  readonly topics = ['FOOD_DRINKS', 'WORK', 'PRESENT_SIMPLE'];

  constructor(private http: HttpClient, private userService: UserService) {}
  recommendTask(topic: string): Observable<Bit> {
    const user = this.userService.userId;
    return of({
      type: 'essay',
      instruction: `Here is your task about ${topic}`,
    } as Bit);
    return this.http.post<Bit>(`/api/task/recommend`, {
      topic,
      user,
    });
  }
}
