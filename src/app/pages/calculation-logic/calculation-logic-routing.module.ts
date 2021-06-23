import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalculationLogicPage } from './calculation-logic.page';

const routes: Routes = [
  {
    path: '',
    component: CalculationLogicPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalculationLogicPageRoutingModule {}
