import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoanTopupPageRoutingModule } from './loan-topup-routing.module';
import { LoanTopupPage } from './loan-topup.page';
import { PipesModule } from '../../pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    LoanTopupPageRoutingModule
  ],
  declarations: [LoanTopupPage]
})
export class LoanTopupPageModule {}
