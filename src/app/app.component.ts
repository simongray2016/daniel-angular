import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { BehaviorSubject, Observable, timer, zip } from 'rxjs';
import { find } from 'rxjs/operators';
import { AuthService } from 'src/services/auth.service';
import { FirebaseService } from 'src/services/firebase.service';
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
    private _firebase: FirebaseService,
    private _router: Router,
    private _location: Location
  ) {}

  ngOnInit() {
    this.setLoadingScreen();
    this.handleAuthStateChange();
    this.checkFirebaseAuthToken();
  }

  setLoadingScreen() {
    const nextAuthState$ = this.authState$.pipe(
      find((state) => state !== AuthStateEnum.unknow)
    );
    zip(nextAuthState$, timer(2000)).subscribe(() =>
      this.loadingScreenSubject$.next(false)
    );
  }

  checkFirebaseAuthToken() {
    const refreshToken = this._auth.getRefreshToken();
    if (refreshToken) {
      this._firebase.exchangeWithRefreshToken(refreshToken).subscribe(
        () => this._auth.setAuthState(AuthStateEnum.authenticated),
        () => this._auth.setAuthState(AuthStateEnum.unAuthenticated)
      );
    } else {
      this._auth.setAuthState(AuthStateEnum.unAuthenticated);
    }
  }

  handleAuthStateChange() {
    this.authState$.subscribe((state: AuthStateEnum) => {
      switch (state) {
        case AuthStateEnum.unAuthenticated:
          this.navigateSignInPage();
          break;
        default:
          break;
      }
    });
  }

  navigateSignInPage() {
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
