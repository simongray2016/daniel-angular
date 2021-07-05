import { Component, OnInit } from '@angular/core';
import { MediaService } from 'src/services/media.service';

@Component({
  selector: 'app-dashboard-screen',
  templateUrl: './dashboard-screen.component.html',
})
export class DashboardScreenComponent implements OnInit {
  constructor(private _media: MediaService) {}

  ngOnInit(): void {}

  toggleFullscreen() {
    this._media.toggleFullscreen();
  }
}
