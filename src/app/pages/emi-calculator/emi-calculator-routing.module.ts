import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmiCalculatorPage } from './emi-calculator.page';

const routes: Routes = [
  {
    path: '',
    component: EmiCalculatorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmiCalculatorPageRoutingModule {}
