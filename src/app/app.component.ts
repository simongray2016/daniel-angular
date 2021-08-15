import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { Select } from '@ngxs/store';
import { BehaviorSubject, Observable, Subject, timer, zip } from 'rxjs';
import { find, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/services/auth.service';
import { DateService } from 'src/services/date.service';
import { MediaService } from 'src/services/media.service';
import { SearchService } from 'src/services/search.service';
import { ThemeModeService } from 'src/services/theme-mode.service';
import { AuthState, AuthStateEnum } from 'src/shared/states/auth/auth.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [
    `
      :host {
        position: relative;
      }
    `,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav)
  matSidenav!: MatSidenav;

  @Select(AuthState)
  authState$!: Observable<AuthStateEnum>;
  darkMode$: Observable<boolean>;
  isOpenSearchBar$: Observable<boolean>;
  authenticated = AuthStateEnum.authenticated;
  loadingScreenSubject$ = new BehaviorSubject<boolean>(true);
  loadingScreen$ = this.loadingScreenSubject$.asObservable();
  destroyed$ = new Subject<any>();

  sidenavMode: MatDrawerMode = 'side';
  preOpeningSidenav = true;

  constructor(
    private _themeMode: ThemeModeService,
    private _media: MediaService,
    private _search: SearchService
  ) {
    this.darkMode$ = this._themeMode.darkMode$;
    this.isOpenSearchBar$ = this._search.isOpenSearchBar$;
    this.handleLargeScreenSize();
  }

  ngOnInit() {
    this.setLoadingScreen();
    this.checkAuthenticateWhenInitApp();
  }

  ngOnDestroy() {
    this.destroyed$.next(null);
  }

  setLoadingScreen() {
    const nextAuthState$ = this.authState$.pipe(
      find((state) => state !== AuthStateEnum.unknow)
    );
    zip(nextAuthState$, timer(2000)).subscribe(() =>
      this.loadingScreenSubject$.next(false)
    );
  }

  checkAuthenticateWhenInitApp() {}

  handleLargeScreenSize() {
    this._media
      .handleMediaBreakpoint('lg')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isInBreakpoint) => {
        if (isInBreakpoint) {
          this.sidenavMode = 'side';
          this.preOpeningSidenav = true;
        } else {
          this.sidenavMode = 'over';
          this.matSidenav?.close();
          this.preOpeningSidenav = false;
        }
      });
  }
}
