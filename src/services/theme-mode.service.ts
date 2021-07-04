import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeModeService {
  constructor() {}

  toggleDarkMode(isOn: boolean = true) {
    if (isOn) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
