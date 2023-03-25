import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  /**
   * Gets user id from class, localstorage or creates a new one if it doesn't exist.
   **/
  get userId(): string {
    if (this._userId != null) {
      return this._userId;
    } else {
      const userIdLocalStorage = this.getUserKeyFromLocalStorage();
      if (userIdLocalStorage) {
        this._userId = userIdLocalStorage;
        return this._userId;
      } else {
        this._userId = crypto.randomUUID();
        this.persistUserKeyToLocalStorage(this._userId);
        return this._userId;
      }
    }
  }

  private readonly userIdKey = 'USERID';

  private _userId: string | null = this.getUserKeyFromLocalStorage();

  constructor() {}

  private getUserKeyFromLocalStorage() {
    return localStorage.getItem(this.userIdKey);
  }

  private persistUserKeyToLocalStorage(identifier: string) {
    localStorage.setItem(this.userIdKey, identifier);
  }
}
