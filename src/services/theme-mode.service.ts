import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { skip } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeModeService {
  private darkModeSubject$ = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkModeSubject$.asObservable();

  constructor(private _localStorage: LocalStorageService) {
    this.checkDarkModeInLocalStorage();
    this.applyDarkMode();
  }

  applyDarkMode() {
    this.darkModeSubject$.pipe(skip(1)).subscribe((darkMode) => {
      if (darkMode) {
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
      }
    });
  }

  checkDarkModeInLocalStorage() {
    let darkMode = this._localStorage.getItem('darkMode');
    if (darkMode === null) darkMode = this.darkModeSubject$.value;
    this.setDarkMode(darkMode);
  }

  setDarkMode(darkMode: boolean) {
    this.darkModeSubject$.next(darkMode);
    this._localStorage.setItem('darkMode', darkMode);
  }

  toggleDarkMode() {
    this.setDarkMode(!this.darkModeSubject$.value);
  }
}
