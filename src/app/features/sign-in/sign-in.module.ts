import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInRoutingModule } from './sign-in-routing.module';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

import { SignInScreenComponent } from './sign-in-screen/sign-in-screen.component';

@NgModule({
  declarations: [SignInScreenComponent],
  imports: [
    CommonModule,
    SignInRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
})
export class SignInModule {}
