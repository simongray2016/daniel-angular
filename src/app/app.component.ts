import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _location: Location,
    private _date: DateService,
    private _themeMode: ThemeModeService,
    private _media: MediaService,
    private _search: SearchService
  ) {
    this.darkMode$ = this._themeMode.darkMode$;
    this.isOpenSearchBar$ = this._search.isOpenSearchBar$;
  }

  ngOnInit() {
    this.setLoadingScreen();
    this.handleAuthStateChange();
    this.checkAuthenticateWhenInitApp();
    this.handleMediumScreenSize();
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

  checkAuthenticateWhenInitApp() {
    const rememberUser = this._auth.getRememberUser();
    const refreshToken = this._auth.getRefreshToken();
    const expireTime = this._auth.getExpireTime();
    const isExpired = expireTime && this._date.getTime() > expireTime;
    if (refreshToken) {
      switch (true) {
        case rememberUser:
          this._auth.signInWithToken(refreshToken!).subscribe();
          break;
        case !rememberUser && isExpired:
          this._auth.signOut();
          break;
        case !rememberUser && !isExpired:
          this._auth.setAuthState(AuthStateEnum.authenticated);
          break;
        default:
          this._auth.setAuthState(AuthStateEnum.unAuthenticated);
          break;
      }
    } else {
      this._auth.setAuthState(AuthStateEnum.unAuthenticated);
    }
  }

  handleAuthStateChange() {
    this.authState$.subscribe((state: AuthStateEnum) => {
      switch (state) {
        case AuthStateEnum.unAuthenticated:
          this.navigateWhenUnAuthenticated();
          break;
        case AuthStateEnum.authenticated:
          this.navigateWhenAuthenticated();
          break;
        default:
          break;
      }
    });
  }

  navigateWhenAuthenticated() {
    const locationPath = this._location.path();
    const { returnUrl } = this._route.snapshot.queryParams;
    const isFromSignInSignUp =
      locationPath.includes('/sign-in') || locationPath.includes('/sign-up');
    if (isFromSignInSignUp) {
      this._router.navigateByUrl(returnUrl || '');
    }
  }

  navigateWhenUnAuthenticated() {
    const locationPath = this._location.path();
    const isFromAuthenticatedUrl =
      this.checkIsFromAuthenticatedUrl(locationPath);
    if (isFromAuthenticatedUrl) {
      this._router.navigate(['/sign-in'], {
        queryParams: locationPath
          ? {
              returnUrl: locationPath,
            }
          : {},
      });
    } else {
      this._router.navigateByUrl(locationPath);
    }
  }

  checkIsFromAuthenticatedUrl(path: string): boolean {
    switch (true) {
      case path.includes('/sign-in'):
      case path.includes('/sign-up'):
        return false;
      default:
        return true;
    }
  }

  handleMediumScreenSize() {
    this._media
      .handleMediaBreakpoint('md')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isInBreakpoint) => {
        if (isInBreakpoint) {
          this.sidenavMode = 'side';
        } else {
          this.sidenavMode = 'over';
          this.matSidenav.close();
        }
      });
  }
}
