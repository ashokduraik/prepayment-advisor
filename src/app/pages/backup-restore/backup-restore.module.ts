import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BackupRestorePageRoutingModule } from './backup-restore-routing.module';

import { BackupRestorePage } from './backup-restore.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BackupRestorePageRoutingModule
  ],
  declarations: [BackupRestorePage]
})
export class BackupRestorePageModule {}
