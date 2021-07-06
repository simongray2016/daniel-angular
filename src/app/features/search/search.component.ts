import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Observable } from 'rxjs';
import { SearchService } from 'src/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  animations: [
    trigger('sideUpTrigger', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('200ms', style({ transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)' }),
        animate('200ms', style({ transform: 'translateY(-100%)' })),
      ]),
    ]),
  ],
})
export class SearchComponent implements OnInit {
  isOpenSearchBar$: Observable<boolean>;

  constructor(private _search: SearchService) {
    this.isOpenSearchBar$ = this._search.isOpenSearchBar$;
  }

  ngOnInit(): void {}

  toggleSearchBar() {
    this._search.toggleSearchBar();
  }
}
