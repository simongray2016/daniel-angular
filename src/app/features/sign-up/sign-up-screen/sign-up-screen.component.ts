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
import { AuthService } from 'src/services/auth.service';
import { SnackBarService } from 'src/services/snack-bar.service';

@Component({
  selector: 'app-sign-up-screen',
  templateUrl: './sign-up-screen.component.html',
})
export class SignUpScreenComponent implements OnInit {
  hidePassword = true;
  loading = false;
  signUpForm: FormGroup;

  constructor(
    private _auth: AuthService,
    private _fb: FormBuilder,
    private _snackBar: SnackBarService
  ) {
    this.signUpForm = this._fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  get fullName() {
    return this.signUpForm.controls.fullName;
  }

  get email() {
    return this.signUpForm.controls.email;
  }

  get password() {
    return this.signUpForm.controls.password;
  }

  getErrorMessage(controls: AbstractControl): string {
    if (controls.hasError('required')) {
      return 'You must enter a value';
    }
    return controls.hasError('email') ? 'Email is not valid' : '';
  }

  signIn() {
    if (this.signUpForm.valid) {
      const { email, password, rememberUser } = this.signUpForm.controls;
      this._auth
        .signInWithEmailPassword({
          email: email.value,
          password: password.value,
          rememberUser: rememberUser.value,
        })
        .pipe(
          startWith(null),
          tap(() => {
            this.loading = true;
            this.signUpForm.disable();
          }),
          finalize(() => {
            this.loading = false;
            this.signUpForm.enable();
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
