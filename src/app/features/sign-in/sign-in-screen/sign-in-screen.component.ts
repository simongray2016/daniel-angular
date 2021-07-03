import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { throwError } from 'rxjs';
import { catchError, finalize, startWith, tap } from 'rxjs/operators';
import { FirebaseService } from 'src/services/firebase.service';
import { SnackBarService } from 'src/services/snack-bar.service';

@Component({
  selector: 'app-sign-in-screen',
  templateUrl: './sign-in-screen.component.html',
  styleUrls: ['./sign-in-screen.component.scss'],
})
export class SignInScreenComponent implements OnInit {
  hidePassword = true;
  loading = false;
  signInForm: FormGroup;

  constructor(
    private _firebase: FirebaseService,
    private _fb: FormBuilder,
    private _snackBar: SnackBarService
  ) {
    this.signInForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      returnSecureToken: [false],
    });
  }

  ngOnInit(): void {}

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
      const { email, password, returnSecureToken } = this.signInForm.controls;
      this._firebase
        .signInWithEmailPassword({
          email: email.value,
          password: password.value,
          returnSecureToken: returnSecureToken.value,
        })
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
