import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrepaymentPage } from './prepayment.page';

const routes: Routes = [
  {
    path: '',
    component: PrepaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrepaymentPageRoutingModule {}
