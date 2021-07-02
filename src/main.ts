import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import {
  FIREBASE_CONFIG,
  FIREBASE_DI_COFIG,
} from './environments/firebase.config';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic([
  { provide: FIREBASE_CONFIG, useValue: FIREBASE_DI_COFIG },
])
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
