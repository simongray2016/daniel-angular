import { Component, Input, OnInit } from '@angular/core';
import { FadeInFadeOutTrigger } from 'src/shared/animations/fade.animation';

@Component({
  selector: 'app-music-slider',
  templateUrl: './music-slider.component.html',
  animations: [FadeInFadeOutTrigger],
})
export class MusicSliderComponent implements OnInit {
  @Input() playlist: any[] = [];

  trackHovered: number | null = null;

  constructor() {}

  ngOnInit(): void {}
}
