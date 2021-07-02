import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private _auth: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authReq = this.setAuthRequest(request);
    const nextReq = authReq.clone();
    return next.handle(nextReq);
  }

  setAuthRequest(request: HttpRequest<unknown>): HttpRequest<unknown> {
    const idToken = this._auth.getIdToken();
    const isExchangeRefreshToken = request.url.includes(
      'https://securetoken.googleapis.com/v1/token?key='
    );
    return request.clone({
      headers: new HttpHeaders().set(
        'Content-Type',
        `application/${
          isExchangeRefreshToken ? 'x-www-form-urlencoded' : 'application/json'
        }`
      ),
      params:
        idToken && !isExchangeRefreshToken
          ? new HttpParams().set('auth', idToken)
          : undefined,
    });
  }
}
