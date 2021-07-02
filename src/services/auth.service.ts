import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetAuthState } from 'src/shared/states/auth/auth.actions';
import { AuthStateEnum } from 'src/shared/states/auth/auth.state';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private _localStorage: LocalStorageService,
    private _store: Store
  ) { }

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
