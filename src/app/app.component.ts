import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { BehaviorSubject, Observable, timer, zip } from 'rxjs';
import { find } from 'rxjs/operators';
import { AuthService } from 'src/services/auth.service';
import { DateService } from 'src/services/date.service';
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

  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _location: Location,
    private _date: DateService
  ) {}

  ngOnInit() {
    this.setLoadingScreen();
    this.handleAuthStateChange();
    this.checkAuthenticateWhenInitApp();
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
    switch (true) {
      case rememberUser && refreshToken:
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
    const isFromSignIn = locationPath.includes('/sign-in');
    if (isFromSignIn) {
      this._router.navigateByUrl(returnUrl || '');
    }
  }

  navigateWhenUnAuthenticated() {
    const locationPath = this._location.path();
    const isFromOtherUrl = !locationPath.includes('/sign-in');
    if (isFromOtherUrl) {
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
}
