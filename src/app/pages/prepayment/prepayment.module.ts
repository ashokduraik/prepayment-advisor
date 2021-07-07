import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PipesModule } from '../../pipes.module';
import { PrepaymentPage } from './prepayment.page';
import { PrepaymentPageRoutingModule } from './prepayment-routing.module';
import { AmountInputModule } from '../../directive/amount-input/amount-input.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    AmountInputModule,
    PrepaymentPageRoutingModule
  ],
  declarations: [PrepaymentPage]
})
export class PrepaymentPageModule { }
