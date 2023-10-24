import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LedgerEntryPage } from './ledger-entry.page';

const routes: Routes = [
  {
    path: '',
    component: LedgerEntryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LedgerEntryPageRoutingModule { }
