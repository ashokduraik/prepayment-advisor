import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmiEditPage } from './emi-edit.page';

const routes: Routes = [
  {
    path: '',
    component: EmiEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmiEditPageRoutingModule {}
