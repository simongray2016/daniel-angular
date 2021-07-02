import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/services/firebase.service';

@Component({
  selector: 'app-sign-in-screen',
  templateUrl: './sign-in-screen.component.html',
  styleUrls: ['./sign-in-screen.component.scss'],
})
export class SignInScreenComponent implements OnInit {
  constructor(private _firebase: FirebaseService) {}

  ngOnInit(): void {}

  signIn() {
    this._firebase
      .signInWithEmailPassword({
        email: 'teo@gmail.com',
        password: '123456',
        returnSecureToken: true,
      })
      .subscribe();
  }
}
