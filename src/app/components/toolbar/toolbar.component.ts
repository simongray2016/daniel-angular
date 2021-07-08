import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { MediaService } from 'src/services/media.service';
import { SearchService } from 'src/services/search.service';
import { ThemeModeService } from 'src/services/theme-mode.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent implements OnInit {
  @Output() toggleSidenav = new EventEmitter();

  darkMode$: Observable<boolean>;

  constructor(
    private _themeMode: ThemeModeService,
    private _search: SearchService,
    private _media: MediaService
  ) {
    this.darkMode$ = this._themeMode.darkMode$;
  }

  ngOnInit(): void {}

  onToggleSidenav() {
    this.toggleSidenav.emit();
  }

  toggleFullscreen() {
    this._media.toggleFullscreen();
  }

  toggleDarkMode() {
    this._themeMode.toggleDarkMode();
  }

  toggleSearchBar() {
    this._search.toggleSearchBar();
  }
}
