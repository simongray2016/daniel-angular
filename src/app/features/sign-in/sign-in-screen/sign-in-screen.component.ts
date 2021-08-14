import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, finalize, startWith, tap } from 'rxjs/operators';
import { AuthService } from 'src/services/auth.service';
import { SnackBarService } from 'src/services/snack-bar.service';

@Component({
  selector: 'app-sign-in-screen',
  templateUrl: './sign-in-screen.component.html',
  styles: [
    `
      ::ng-deep {
        .mat-progress-spinner circle,
        .mat-spinner circle {
          stroke: white;
        }
      }
    `,
  ],
})
export class SignInScreenComponent implements OnInit {
  hidePassword = true;
  loading = false;
  signInForm: FormGroup;
  returnUrl = '';

  constructor(
    private _auth: AuthService,
    private _fb: FormBuilder,
    private _snackBar: SnackBarService,
    private _route: ActivatedRoute
  ) {
    this.signInForm = this._fb.group({
      email: ['teo@gmail.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required]],
      rememberUser: [false],
    });
  }

  ngOnInit(): void {
    this.returnUrl = this._route.snapshot.queryParams.returnUrl || '';
  }

  get email() {
    return this.signInForm.controls.email;
  }

  get password() {
    return this.signInForm.controls.password;
  }

  getErrorMessage(controls: AbstractControl): string {
    if (controls.hasError('required')) {
      return 'You must enter a value';
    }
    return controls.hasError('email') ? 'Email is not valid' : '';
  }

  signIn() {
    if (this.signInForm.valid) {
      const { email, password, rememberUser } = this.signInForm.controls;
      this._auth
        .signInWithEmailPassword(
          {
            email: email.value,
            password: password.value,
            rememberUser: rememberUser.value,
          },
          this.returnUrl
        )
        .pipe(
          startWith(null),
          tap(() => {
            this.loading = true;
            this.signInForm.disable();
          }),
          finalize(() => {
            this.loading = false;
            this.signInForm.enable();
          }),
          catchError((err: HttpErrorResponse) => {
            this.handleSignInError(err);
            return throwError('err');
          })
        )
        .subscribe();
    }
  }

  handleSignInError(httpErrorResponse: HttpErrorResponse) {
    if (httpErrorResponse.error?.error?.code === 400) {
      const message = 'Wrong email or password!';
      this._snackBar.showErrorSnackBar(message);
    }
  }

  toggleHidePassword() {
    this.hidePassword = !this.hidePassword;
  }
}
