import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInScreenComponent } from './sign-in-screen/sign-in-screen.component';

const routes: Routes = [
  {
    path: '', component: SignInScreenComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignInRoutingModule { }
