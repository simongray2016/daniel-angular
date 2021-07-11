import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { DashboardScreenComponent } from './dashboard-screen/dashboard-screen.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [DashboardScreenComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
})
export class DashboardModule {}
