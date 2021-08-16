import { Injectable } from '@angular/core';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { Collection } from 'src/app/mock/playlist.data';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  collection = Collection;

  constructor() {}

  getCollection() {
    return timer(3000).pipe(map(() => this.collection));
  }
}
