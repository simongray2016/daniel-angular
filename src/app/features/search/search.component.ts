import { Component, OnInit } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { SearchService } from 'src/services/search.service';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { SlideYTrigger } from 'src/shared/animations/slide.animation';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  animations: [SlideYTrigger],
})
export class SearchComponent implements OnInit {
  searchResult$!: Observable<any[]>;

  isOpenSearchBar = true;
  haveResult = false;
  searchControl = new FormControl('');
  errorMessage: string | null = null;

  constructor(private _search: SearchService) {}

  ngOnInit(): void {
    this.onSearchValueChanges();
  }

  onSearchValueChanges() {
    this.searchResult$ = this.searchControl.valueChanges.pipe(
      debounceTime(200),
      switchMap((searchString: string) => {
        if (searchString.trim().length > 1) {
          this.haveResult = true;
          return this._search.getSearchresult(searchString.trim());
        } else {
          this.haveResult = false;
          return of([]);
        }
      }),
      tap(
        (res) =>
          (this.haveResult = !!res.length && res.some((cat) => cat.list.length))
      )
    );
  }

  onClickSearchResultItem(category: string, item: any) {
    switch (category) {
      case 'contacts':
        break;
      case 'pages':
        break;
      case 'tasks':
        break;
      default:
        break;
    }
    this.close();
  }

  close() {
    this.searchControl.setValue('');
    this.isOpenSearchBar = false;
    timer(200).subscribe(() => this._search.toggleSearchBar());
  }
}
