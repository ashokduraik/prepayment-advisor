import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayAreaFilterPage } from './play-area-filter.page';

const routes: Routes = [
  {
    path: '',
    component: PlayAreaFilterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayAreaFilterPageRoutingModule {}
