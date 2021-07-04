import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  FirebaseConfig,
  FIREBASE_CONFIG,
} from 'src/environments/firebase.config';
import { SignInBodyModel, AuthenticatedDataModel } from '../models/authmodel';
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(
    @Inject(FIREBASE_CONFIG) private _firebaseConfig: FirebaseConfig,
    private _http: HttpClient
  ) {}

  exchangeWithRefreshToken(refreshToken: string): Observable<any> {
    const { apiKey } = this._firebaseConfig;
    return this._http.post(
      `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
      `grant_type=refresh_token&refresh_token=${refreshToken}`
    );
  }

  signInWithEmailPassword({
    email,
    password,
    returnSecureToken = true,
  }: SignInBodyModel): Observable<AuthenticatedDataModel> {
    const { apiKey } = this._firebaseConfig;
    return this._http.post<AuthenticatedDataModel>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        email,
        password,
        returnSecureToken,
      }
    );
  }
}
