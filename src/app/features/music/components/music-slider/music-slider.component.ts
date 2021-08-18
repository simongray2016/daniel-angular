import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, Subject, timer } from 'rxjs';
import { map, startWith, takeUntil, throttleTime } from 'rxjs/operators';
import { MediaService } from 'src/services/media.service';
import { FadeInFadeOutTrigger } from 'src/shared/animations/fade.animation';

@Component({
  selector: 'app-music-slider',
  templateUrl: './music-slider.component.html',
  animations: [FadeInFadeOutTrigger],
})
export class MusicSliderComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() playlist: any[] = [];

  @ViewChild('musicSlider', { read: ElementRef, static: true })
  musicSlider!: ElementRef<any>;
  @ViewChild('scrollView', { read: ElementRef, static: true })
  scrollView!: ElementRef<any>;

  destroy$: Subject<null> = new Subject();
  musicSliderElementWidth$: BehaviorSubject<{
    scrollWidth: number;
    clientWidth: number;
  }> = new BehaviorSubject({ scrollWidth: 0, clientWidth: 0 });
  forwardButtonHovered$: Subject<null> = new Subject();
  backwardButtonHovered$: Subject<null> = new Subject();
  silderForwardButton$!: Observable<boolean>;
  sliderBackwardButton$!: Observable<boolean>;

  trackHovered: number | null = null;
  scrollXPosition = 0;

  constructor(private _media: MediaService, private _cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.listenScrollEvent();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
  }

  ngAfterViewInit(): void {
    this.listenWindowResize();
    this.toggleSlider();
    this._cdr.detectChanges();
  }

  listenScrollEvent() {
    fromEvent(this.scrollView.nativeElement, 'scroll')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: any) => {
        const { scrollLeft } = event.target;
        this.scrollXPosition = parseInt(scrollLeft.toFixed());
        this.setMusicSliderElementWidth();
      });
  }

  listenWindowResize() {
    this._media
      .windowResize()
      .pipe(startWith(null), takeUntil(this.destroy$))
      .subscribe(() => this.setMusicSliderElementWidth());
  }

  setMusicSliderElementWidth() {
    this.musicSliderElementWidth$.next({
      scrollWidth: this.musicSlider.nativeElement.scrollWidth,
      clientWidth: this.musicSlider.nativeElement.clientWidth,
    });
  }

  toggleSlider() {
    this.silderForwardButton$ = this.musicSliderElementWidth$.pipe(
      map(
        ({ scrollWidth, clientWidth }) =>
          clientWidth < scrollWidth &&
          this.scrollXPosition + clientWidth < scrollWidth
      )
    );

    this.sliderBackwardButton$ = this.musicSliderElementWidth$.pipe(
      map(() => this.scrollXPosition > 0)
    );
  }

  backList() {
    const { clientWidth } = this.musicSlider.nativeElement;
    this.scrollXPosition -=
      this.scrollXPosition > clientWidth ? clientWidth : this.scrollXPosition;
    this.scrollView.nativeElement.scroll({
      top: 0,
      left: this.scrollXPosition,
      behavior: 'smooth',
    });
    this.setMusicSliderElementWidth();
  }

  nextList() {
    const { clientWidth, scrollWidth } = this.musicSlider.nativeElement;
    const restWidth = scrollWidth - (this.scrollXPosition + clientWidth);
    this.scrollXPosition += restWidth > clientWidth ? clientWidth : restWidth;
    this.scrollView.nativeElement.scroll({
      top: 0,
      left: this.scrollXPosition,
      behavior: 'smooth',
    });
    this.setMusicSliderElementWidth();
  }

  listenForwardButtonHover() {
    this.forwardButtonHovered$
      .asObservable()
      .pipe(throttleTime(400))
      .subscribe(() => {
        this.scrollView.nativeElement.scroll({
          top: 0,
          left: this.scrollXPosition + 20,
          behavior: 'smooth',
        });

        timer(300).subscribe(() =>
          this.scrollView.nativeElement.scroll({
            top: 0,
            left: this.scrollXPosition,
            behavior: 'smooth',
          })
        );
      });
  }
}
