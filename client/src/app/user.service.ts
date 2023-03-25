import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userIdKey = 'USERID';

  userId: string | null = this.getUserKeyFromLocalStorage();

  constructor() {}

  initialize() {
    if (this.userId == null) {
      this.userId = crypto.randomUUID();
      this.persistUserKeyToLocalStorage(this.userId);
    }
  }

  getUserKeyFromLocalStorage() {
    return localStorage.getItem(this.userIdKey);
  }

  persistUserKeyToLocalStorage(identifier: string) {
    localStorage.setItem(this.userIdKey, identifier);
  }
}
