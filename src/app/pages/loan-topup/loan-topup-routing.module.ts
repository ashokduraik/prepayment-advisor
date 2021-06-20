import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoanTopupPage } from './loan-topup.page';

const routes: Routes = [
  {
    path: '',
    component: LoanTopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoanTopupPageRoutingModule {}
