import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { camelCase } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SignInBodyModel, AuthenticatedDataModel } from 'src/models/authmodel';
import { SetAuthState } from 'src/shared/states/auth/auth.actions';
import { AuthStateEnum } from 'src/shared/states/auth/auth.state';
import { DateService } from './date.service';
import { FirebaseService } from './firebase.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private _localStorage: LocalStorageService,
    private _store: Store,
    private _firebase: FirebaseService,
    private _date: DateService
  ) {}

  signInWithEmailPassword(
    signInData: SignInBodyModel
  ): Observable<AuthenticatedDataModel> {
    return this._firebase.signInWithEmailPassword(signInData).pipe(
      map((res: AuthenticatedDataModel) => {
        const expireTime = this._date.getTime() + parseInt(res.expiresIn) * 60;
        const newData: AuthenticatedDataModel = {
          ...res,
          rememberUser: signInData.rememberUser,
          expireTime,
        };
        this._localStorage.setItemsFromObject(newData);
        this.setAuthState(AuthStateEnum.authenticated);
        return newData;
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
        this._localStorage.setItemsFromObject(newData);
        this.setAuthState(AuthStateEnum.authenticated);
        return newData;
      })
    );
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
