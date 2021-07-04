import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpScreenComponent } from './sign-up-screen/sign-up-screen.component';

const routes: Routes = [
  {
    path: '',
    component: SignUpScreenComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignUpRoutingModule { }
