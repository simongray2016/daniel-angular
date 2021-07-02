import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthService } from 'src/services/auth.service';
import { FirebaseService } from 'src/services/firebase.service';
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
    private _auth: AuthService,
    private _firebase: FirebaseService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.listenAuthStateChange();
    this.checkFirebaseAuthToken();
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
}
