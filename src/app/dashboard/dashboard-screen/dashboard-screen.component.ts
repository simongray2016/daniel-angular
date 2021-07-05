import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MediaService } from 'src/services/media.service';

@Component({
  selector: 'app-dashboard-screen',
  templateUrl: './dashboard-screen.component.html',
})
export class DashboardScreenComponent implements OnInit {
  @ViewChild(MatSidenav)
  matSidenav!: MatSidenav;

  constructor(private _media: MediaService) {}

  ngOnInit(): void {}

  toggleSidenav() {
    this.matSidenav.toggle();
  }

  toggleFullscreen() {
    this._media.toggleFullscreen();
  }
}
