import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum Language {
  EN = 'EN',
  DE = 'DE',
}

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  language = new BehaviorSubject<Language>(Language.EN);
}
