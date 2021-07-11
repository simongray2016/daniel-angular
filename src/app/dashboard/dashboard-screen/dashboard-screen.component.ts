import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { overviewData } from 'src/app/mock/overview.data';
import packageJson from './../../../../package.json';
import { OverviewData } from './../../../models/dashboard.model';

@Component({
  selector: 'app-dashboard-screen',
  templateUrl: './dashboard-screen.component.html',
})
export class DashboardScreenComponent implements OnInit, OnDestroy {
  package = packageJson;
  overviewData: OverviewData[] = overviewData;

  destroyed$ = new Subject<any>();

  constructor() {}

  ngOnInit(): void {
    console.log({ package: this.package });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(null);
  }
}
