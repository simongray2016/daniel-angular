import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MediaService } from 'src/services/media.service';

@Component({
  selector: 'app-dashboard-screen',
  templateUrl: './dashboard-screen.component.html',
})
export class DashboardScreenComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav)
  matSidenav!: MatSidenav;

  destroyed$ = new Subject<any>();

  sidenavMode: MatDrawerMode = 'side';

  constructor(private _media: MediaService) {}

  ngOnInit(): void {
    this.handleMediumScreenSize();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(null);
  }

  handleMediumScreenSize() {
    this._media
      .handleMediaBreakpoint('md')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isIntarget) => {
        if (isIntarget) {
          this.sidenavMode = 'side';
        } else {
          this.sidenavMode = 'over';
          this.matSidenav.close();
        }
      });
  }

  toggleSidenav() {
    this.matSidenav.toggle();
  }

  toggleFullscreen() {
    this._media.toggleFullscreen();
  }
}
