import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicRoutingModule } from './music-routing.module';

import { MusicScreenComponent } from './music-screen/music-screen.component';
import { MusicSliderComponent } from './components/music-slider/music-slider.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [MusicScreenComponent, MusicSliderComponent],
  imports: [CommonModule, MusicRoutingModule, MatIconModule],
})
export class MusicModule {}
