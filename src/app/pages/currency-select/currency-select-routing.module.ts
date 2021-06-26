import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CurrencySelectComponent } from './currency-select.component';

const routes: Routes = [
  {
    path: '',
    component: CurrencySelectComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CurrencySelectRoutingModule { }
