import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FirebaseService } from 'src/services/firebase.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { SetAuthState } from 'src/shared/states/auth/auth.actions';
import { AuthState, AuthStateEnum } from 'src/shared/states/auth/auth.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @Select(AuthState)
  authState$!: Observable<AuthStateEnum>;

  constructor(
    private _localStorage: LocalStorageService,
    private _firebase: FirebaseService,
    private _store: Store,
    private _router: Router
  ) {}

  ngOnInit() {
    this.listenAuthStateChange();
    this.checkFirebaseAuthToken();
  }

  checkFirebaseAuthToken() {
    const refreshToken = this._localStorage.getItem('refreshToken');
    if (refreshToken) {
      this._firebase.exchangeWithRefreshToken(refreshToken).subscribe(
        () => this.setAuthState(AuthStateEnum.authenticated),
        () => this.setAuthState(AuthStateEnum.unAuthenticated)
      );
    } else {
      this.setAuthState(AuthStateEnum.unAuthenticated);
    }
  }

  listenAuthStateChange() {
    this.authState$.subscribe((state: AuthStateEnum) => {
      switch (state) {
        case AuthStateEnum.authenticated:
          this._router.navigateByUrl('/');
          break;
        case AuthStateEnum.unAuthenticated:
          this._router.navigateByUrl('/sign-in');
          break;
        default:
          break;
      }
    });
  }

  setAuthState(state: AuthStateEnum) {
    this._store.dispatch(new SetAuthState(state));
  }
}
