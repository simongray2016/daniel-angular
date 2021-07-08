import { Injectable } from '@angular/core';
import { isEmpty, isString, values } from 'lodash';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SearchData } from 'src/app/mock/search.data';

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

  getSearchresult(searchString: string): Observable<any[]> {
    searchString = searchString.toLocaleLowerCase();
    return of(SearchData).pipe(
      map((data: any[]) => {
        let searchedData: any[] = [];
        data.forEach((cat) => {
          const filtedData = cat.list.filter((detailData: any) => {
            const res = values(detailData)
              .map((val) => (isString(val) ? val.toLocaleLowerCase() : val))
              .some((val) => isString(val) && val.includes(searchString));
            return res;
          });
          searchedData = [
            ...searchedData,
            {
              category: cat.category,
              list: filtedData,
            },
          ];
        });
        return searchedData;
      })
    );
  }
}
