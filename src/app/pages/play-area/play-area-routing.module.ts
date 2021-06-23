import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayAreaPage } from './play-area.page';

const routes: Routes = [
  {
    path: '',
    component: PlayAreaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayAreaPageRoutingModule {}
