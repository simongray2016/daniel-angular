import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicRoutingModule } from './music-routing.module';

import { MusicScreenComponent } from './music-screen/music-screen.component';
import { MusicSliderComponent } from './components/music-slider/music-slider.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [MusicScreenComponent, MusicSliderComponent],
  imports: [
    CommonModule,
    MusicRoutingModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
})
export class MusicModule {}
