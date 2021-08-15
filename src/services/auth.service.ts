import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { camelCase } from 'lodash';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import {
  SignInBodyModel,
  AuthenticatedDataModel,
  SignUpBodyModal,
} from 'src/models/auth.model';
import { SetAuthState } from 'src/shared/states/auth/auth.actions';
import { AuthState, AuthStateEnum } from 'src/shared/states/auth/auth.state';
import { DateService } from './date.service';
import { FirebaseService } from './firebase.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  @Select(AuthState)
  authState$!: Observable<AuthStateEnum>;

  constructor(
    private _localStorage: LocalStorageService,
    private _store: Store,
    private _firebase: FirebaseService,
    private _date: DateService,
    private _router: Router,
    private _location: Location
  ) {}

  authGuard() {
    return this.authState$.pipe(
      switchMap((state) => {
        if (state === AuthStateEnum.unknow) {
          const rememberUser = this.getRememberUser();
          const refreshToken = this.getRefreshToken();
          const expireTime = this.getExpireTime();
          const isExpired = expireTime && this._date.getTime() > expireTime;
          if (refreshToken) {
            switch (true) {
              case rememberUser:
                return this.signInWithToken(refreshToken!).pipe(
                  switchMap(() => this.authState$)
                );
              case !rememberUser && !isExpired:
                this.setAuthState(AuthStateEnum.authenticated);
                break;
              case !rememberUser && isExpired:
              default:
                this.signOut();
                break;
            }
          } else {
            this.setAuthState(AuthStateEnum.unAuthenticated);
          }
        }
        return this.authState$;
      }),
      filter((state) => state !== AuthStateEnum.unknow),
      map((state) => {
        switch (state) {
          case AuthStateEnum.unAuthenticated:
            const locationPath = this._location.path();
            this._router.navigate(['/sign-in'], {
              queryParams: locationPath
                ? {
                    returnUrl: locationPath,
                  }
                : {},
            });
            break;
          case AuthStateEnum.authenticated:
          default:
            break;
        }
        return state === AuthStateEnum.authenticated;
      })
    );
  }

  signInWithEmailPassword(
    signInData: SignInBodyModel,
    returnUrl: string = ''
  ): Observable<AuthenticatedDataModel> {
    return this._firebase.signInWithEmailPassword(signInData).pipe(
      map((res: AuthenticatedDataModel) => {
        this.setDataResponseSignInSignUpToLocalStorage({
          ...res,
          rememberUser: signInData.rememberUser,
        });
        this.setAuthState(AuthStateEnum.authenticated);
        this._router.navigate([returnUrl], { replaceUrl: true });
        return res;
      })
    );
  }

  signInWithToken(refreshToken: string): Observable<AuthenticatedDataModel> {
    return this._firebase.exchangeWithRefreshToken(refreshToken).pipe(
      map((res: any) => {
        const newData: any = {};
        Object.keys(res).forEach((key) => {
          const camelCaseKey = camelCase(key);
          newData[camelCaseKey] = res[key];
        });
        this.setDataResponseSignInSignUpToLocalStorage(newData);
        this.setAuthState(AuthStateEnum.authenticated);
        return newData;
      })
    );
  }

  signUpWithEmailPassword(
    signUpData: SignUpBodyModal
  ): Observable<AuthenticatedDataModel> {
    return this._firebase.signUpWithEmailPassword(signUpData).pipe(
      map((res: AuthenticatedDataModel) => {
        this.setDataResponseSignInSignUpToLocalStorage({
          ...res,
          rememberUser: true,
        });
        this.setAuthState(AuthStateEnum.authenticated);
        return res;
      })
    );
  }

  setDataResponseSignInSignUpToLocalStorage(res: AuthenticatedDataModel) {
    const expireTime = this._date.getTime() + parseInt(res.expiresIn) * 60;
    const newData: AuthenticatedDataModel = {
      ...res,
      expireTime,
    };
    this._localStorage.setItemsFromObject(newData);
  }

  signOut() {
    const dataCleared: AuthenticatedDataModel = {
      expiresIn: '',
      tokenType: '',
      userId: '',
      accessToken: '',
      displayName: '',
      email: '',
      expireTime: 0,
      idToken: '',
      kind: '',
      localId: '',
      projectId: '',
      refreshToken: '',
      registered: false,
      rememberUser: false,
    };
    this._localStorage.setItemsFromObject(dataCleared);
    this.setAuthState(AuthStateEnum.unAuthenticated);
  }

  getExpireTime(): number | null {
    return this._localStorage.getItem('expireTime');
  }

  getRememberUser(): boolean | null {
    return this._localStorage.getItem('rememberUser');
  }

  getRefreshToken(): string | null {
    return this._localStorage.getItem('refreshToken');
  }

  getIdToken(): string | null {
    return this._localStorage.getItem('idToken');
  }

  setAuthState(state: AuthStateEnum) {
    this._store.dispatch(new SetAuthState(state));
  }
}
