import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-music-slider',
  templateUrl: './music-slider.component.html',
})
export class MusicSliderComponent implements OnInit {
  @Input() playlist: any[] = [];

  trackHovered: number | null = null;

  constructor() {}

  ngOnInit(): void {}
}
