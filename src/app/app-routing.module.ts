import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorScreenComponent } from './components/error-screen/error-screen.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
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
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
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
