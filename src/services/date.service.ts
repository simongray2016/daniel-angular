import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  constructor() {}

  getTime() {
    return new Date().getTime();
  }
}
