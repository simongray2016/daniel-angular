import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ErrorScreenComponent } from './components/error-screen/error-screen.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'music',
    pathMatch: 'full',
  },
  {
    path: 'sign-in',
    loadChildren: () =>
      import('./features/sign-in/sign-in.module').then((m) => m.SignInModule),
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('./features/sign-up/sign-up.module').then((m) => m.SignUpModule),
  },
  {
    path: 'music',
    loadChildren: () =>
      import('./features/music/music.module').then((m) => m.MusicModule),
    canLoad: [AuthGuard],
  },
  {
    path: '404-not-found',
    component: ErrorScreenComponent,
  },
  {
    path: '**',
    redirectTo: '404-not-found',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
