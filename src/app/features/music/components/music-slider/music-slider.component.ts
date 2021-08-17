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
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  takeUntil,
  throttleTime,
} from 'rxjs/operators';
import { MediaService } from 'src/services/media.service';
import { FadeInFadeOutTrigger } from 'src/shared/animations/fade.animation';

@Component({
  selector: 'app-music-slider',
  templateUrl: './music-slider.component.html',
  animations: [FadeInFadeOutTrigger],
})
export class MusicSliderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('musicSlider', { read: ElementRef, static: true })
  musicSlider!: ElementRef<any>;
  @ViewChild('scrollView', { read: ElementRef, static: true })
  scrollView!: ElementRef<any>;
  @ViewChild('silderForwardButton', { read: ElementRef, static: false })
  silderForwardButton!: ElementRef<any>;

  @Input() playlist: any[] = [];

  destroy$: Subject<null> = new Subject();
  musicSliderElementWidth$: BehaviorSubject<{
    scrollWidth: number;
    clientWidth: number;
  }> = new BehaviorSubject({ scrollWidth: 0, clientWidth: 0 });
  silderForwardButton$!: Observable<boolean>;

  trackHovered: number | null = null;

  constructor(private _media: MediaService, private _cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next(null);
  }

  ngAfterViewInit(): void {
    this.listenWindowResize();
    this.toggleSlider();
    this._cdr.detectChanges();
    if (this.silderForwardButton) {
      this.triggerHoverEffect();
    }
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
      map((val) => val.clientWidth < val.scrollWidth),
      distinctUntilChanged()
    );
  }

  nextList() {
    this.scrollView.nativeElement.scroll({
      top: 0,
      left: 100,
      behavior: 'smooth',
    });
  }

  triggerHoverEffect() {
    fromEvent(this.silderForwardButton.nativeElement, 'mouseenter')
      .pipe(throttleTime(400))
      .subscribe(() => {
        this.scrollView.nativeElement.scroll({
          top: 0,
          left: 20,
          behavior: 'smooth',
        });

        timer(300).subscribe(() =>
          this.scrollView.nativeElement.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth',
          })
        );
      });
  }
}
