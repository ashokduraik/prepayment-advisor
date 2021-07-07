import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { PipesModule } from '../../pipes.module';
import { FixedChitFundPage } from './fixed-chit-fund.page';
import { FixedChitFundPageRoutingModule } from './fixed-chit-fund-routing.module';
import { AmountInputModule } from '../../directive/amount-input/amount-input.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    AmountInputModule,
    FixedChitFundPageRoutingModule
  ],
  declarations: [FixedChitFundPage],
  providers: [
    DatePipe
  ],
})
export class FixedChitFundPageModule { }
