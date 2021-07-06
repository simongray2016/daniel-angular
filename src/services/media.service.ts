import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Breakpoint } from 'src/models/media.model';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  readonly breakpoints: (Breakpoint | '')[] = [
    '',
    'sm',
    'md',
    'lg',
    'xl',
    '2xl',
  ];

  constructor(@Inject(DOCUMENT) private _document: Document) {}

  getWindowSize(): Observable<{ height: number; width: number }> {
    const { innerHeight, innerWidth } = window;
    return fromEvent(window, 'resize').pipe(
      map((event: any) => {
        const { currentTarget } = event;
        const { innerHeight, innerWidth } = currentTarget;
        return {
          height: innerHeight,
          width: innerWidth,
        };
      }),
      startWith({
        height: innerHeight,
        width: innerWidth,
      })
    );
  }

  getMediaBreakpoint(): Observable<Breakpoint | ''> {
    return this.getWindowSize().pipe(
      map((size) => {
        const { width } = size;
        let breakpoint: Breakpoint | '' = '';
        if (width >= 1536) {
          breakpoint = '2xl';
        } else if (width >= 1280) {
          breakpoint = 'xl';
        } else if (width >= 1024) {
          breakpoint = 'lg';
        } else if (width >= 768) {
          breakpoint = 'md';
        } else if (width >= 640) {
          breakpoint = 'sm';
        }
        return breakpoint;
      }),
      distinctUntilChanged()
    );
  }

  handleMediaBreakpoint(breakpoint: Breakpoint) {
    return this.getMediaBreakpoint().pipe(
      map(
        (breakpointScreen) =>
          this.breakpoints.indexOf(breakpointScreen) >=
          this.breakpoints.indexOf(breakpoint)
      ),
      distinctUntilChanged()
    );
  }

  toggleFullscreen() {
    let isFullscreen = this._document.fullscreenElement;
    if (isFullscreen) {
      this._document.exitFullscreen();
    } else {
      this._document.body.requestFullscreen();
    }
  }
}
