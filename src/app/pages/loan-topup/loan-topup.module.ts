import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PipesModule } from '../../pipes.module';
import { LoanTopupPage } from './loan-topup.page';
import { LoanTopupPageRoutingModule } from './loan-topup-routing.module';
import { AmountInputModule } from '../../directive/amount-input/amount-input.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    AmountInputModule,
    LoanTopupPageRoutingModule
  ],
  declarations: [LoanTopupPage]
})
export class LoanTopupPageModule { }
