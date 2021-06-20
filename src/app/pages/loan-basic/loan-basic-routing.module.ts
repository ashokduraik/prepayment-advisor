import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoanBasicComponent } from './loan-basic.component';

const routes: Routes = [
  {
    path: '',
    component: LoanBasicComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoanDetailsPageRoutingModule {}
