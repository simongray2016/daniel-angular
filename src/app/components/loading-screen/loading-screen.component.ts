import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styles: [
    `
      :host {
        position: absolute;
        width: 100%;
        height: 100vh;
        z-index: 1000;
      }
    `,
  ],
})
export class LoadingScreenComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
