import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, startWith } from 'rxjs/operators';
import { FirebaseService } from 'src/services/firebase.service';

@Component({
  selector: 'app-sign-in-screen',
  templateUrl: './sign-in-screen.component.html',
  styleUrls: ['./sign-in-screen.component.scss'],
})
export class SignInScreenComponent implements OnInit {
  hidePassword = true;
  loading = false;
  signInForm: FormGroup;

  constructor(private _firebase: FirebaseService, private _fb: FormBuilder) {
    this.signInForm = this._fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      returnSecureToken: [false],
    });
  }

  ngOnInit(): void {}

  signIn() {
    if (this.signInForm.valid) {
      const { email, password, returnSecureToken } = this.signInForm.controls;
      this.loading = true;
      this.signInForm.disable();
      this._firebase
        .signInWithEmailPassword({
          email: email.value,
          password: password.value,
          returnSecureToken: returnSecureToken.value,
        })
        .pipe(
          finalize(() => {
            this.loading = false;
            this.signInForm.enable();
          })
        )
        .subscribe();
    }
  }

  toggleHidePassword() {
    this.hidePassword = !this.hidePassword;
  }
}
