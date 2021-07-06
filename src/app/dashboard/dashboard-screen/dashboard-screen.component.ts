import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard-screen',
  templateUrl: './dashboard-screen.component.html',
})
export class DashboardScreenComponent implements OnInit, OnDestroy {

  destroyed$ = new Subject<any>();

  constructor() {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroyed$.next(null);
  }
}
