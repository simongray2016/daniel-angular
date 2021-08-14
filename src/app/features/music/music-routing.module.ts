import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MusicScreenComponent } from './music-screen/music-screen.component';

const routes: Routes = [
  {
    path: '',
    component: MusicScreenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MusicRoutingModule {}
