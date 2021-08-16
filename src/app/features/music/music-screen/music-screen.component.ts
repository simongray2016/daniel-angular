import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MusicService } from 'src/services/music.service';

@Component({
  selector: 'app-music-screen',
  templateUrl: './music-screen.component.html',
})
export class MusicScreenComponent implements OnInit {
  collection$!: Observable<any[]>;

  constructor(private _music: MusicService) {}

  ngOnInit(): void {
    this.getCollection();
  }

  getCollection() {
    this.collection$ = this._music.getCollection();
  }
}
