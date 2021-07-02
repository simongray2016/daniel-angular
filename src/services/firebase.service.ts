import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  FirebaseConfig,
  FIREBASE_CONFIG,
} from 'src/environments/firebase.config';
import { SignInBodyModel, SignInResponeModel } from '../models/firebase.model';
import { LocalStorageService } from './local-storage.service';
import { camelCase } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(
    @Inject(FIREBASE_CONFIG) private _firebaseConfig: FirebaseConfig,
    private _http: HttpClient,
    private _localStorage: LocalStorageService
  ) {}

  exchangeWithRefreshToken(refresh_token: string) {
    const { apiKey } = this._firebaseConfig;
    return this._http
      .post(
        `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
        `grant_type=refresh_token&refresh_token=${refresh_token}`,
        {
          headers: new HttpHeaders().set(
            'Content-Type',
            'application/x-www-form-urlencoded'
          ),
        }
      )
      .pipe(
        map((res: any) => {
          const mappedRes: any = {};
          Object.keys(res).forEach((key) => {
            const camelCaseKey = camelCase(key);
            mappedRes[camelCaseKey] = res[key];
          });
          this._localStorage.setItemsFromObject(mappedRes);
        })
      );
  }

  signInWithEmailPassword({
    email,
    password,
    returnSecureToken,
  }: SignInBodyModel): Observable<any> {
    const { apiKey } = this._firebaseConfig;
    return this._http
      .post<SignInResponeModel>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        {
          email,
          password,
          returnSecureToken,
        },
        {
          headers: new HttpHeaders().set('Content-Type', 'application/json'),
        }
      )
      .pipe(
        map((res: SignInResponeModel) => {
          this._localStorage.setItemsFromObject(res);
          return true;
        }),
        catchError(() => of(false))
      );
  }
}
