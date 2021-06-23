import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmiEditPageRoutingModule } from './emi-edit-routing.module';
import { EmiEditPage } from './emi-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmiEditPageRoutingModule
  ],
  declarations: [EmiEditPage]
})
export class EmiEditPageModule {}
