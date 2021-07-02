import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BackupRestorePage } from './backup-restore.page';

const routes: Routes = [
  {
    path: '',
    component: BackupRestorePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackupRestorePageRoutingModule {}
