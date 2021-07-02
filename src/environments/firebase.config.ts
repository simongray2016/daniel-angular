import { InjectionToken } from '@angular/core';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const FIREBASE_CONFIG = new InjectionToken<FirebaseConfig>(
  'firebase.config'
);

export const FIREBASE_DI_COFIG: FirebaseConfig = {
  apiKey: 'AIzaSyCg-u5FClU1Xr0n40D20A42nlo_td1-LAw',
  authDomain: 'daniel-angular.firebaseapp.com',
  projectId: 'daniel-angular',
  storageBucket: 'daniel-angular.appspot.com',
  messagingSenderId: '667601305142',
  appId: '1:667601305142:web:d2f97ba2b4aa77f21ee297',
};
