import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private isOpenSearchBarSubject$ = new BehaviorSubject<boolean>(false);
  isOpenSearchBar$ = this.isOpenSearchBarSubject$.asObservable();

  constructor() {}

  toggleSearchBar() {
    this.isOpenSearchBarSubject$.next(!this.isOpenSearchBarSubject$.value);
  }
}
