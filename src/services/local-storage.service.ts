import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  setItemsFromObject(object: any) {
    object instanceof Object &&
      Object.keys(object).forEach((key: string) =>
        this.setItem(key, object[key])
      );
  }

  setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string): any {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
}
