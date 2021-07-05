import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(@Inject(DOCUMENT) private _document: Document) {}

  toggleFullscreen() {
    let isFullscreen = this._document.fullscreenElement;
    if (isFullscreen) {
      this._document.exitFullscreen();
    } else {
      this._document.body.requestFullscreen();
    }
  }
}
