import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmiProjectionPage } from './emi-projection.page';

const routes: Routes = [
  {
    path: '',
    component: EmiProjectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmiProjectionPageRoutingModule {}
