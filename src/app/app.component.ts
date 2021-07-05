import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { BehaviorSubject, interval, Observable, timer, zip } from 'rxjs';
import { find } from 'rxjs/operators';
import { AuthService } from 'src/services/auth.service';
import { DateService } from 'src/services/date.service';
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
export class AppComponent implements OnInit {
  @Select(AuthState)
  authState$!: Observable<AuthStateEnum>;
  loadingScreenSubject$ = new BehaviorSubject<boolean>(true);
  loadingScreen$ = this.loadingScreenSubject$.asObservable();

  on = false;

  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _location: Location,
    private _date: DateService,
    private _themeMode: ThemeModeService
  ) {}

  ngOnInit() {
    this.setLoadingScreen();
    this.handleAuthStateChange();
    this.checkAuthenticateWhenInitApp();
    interval(3000).subscribe(() => {
      this.on = !this.on;
      this._themeMode.toggleDarkMode(this.on);
    });
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
}
