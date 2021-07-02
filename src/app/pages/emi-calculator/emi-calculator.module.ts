import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../../pipes.module';
import { AppCurrencyPipe } from '../../services/app.pipe';
import { EmiCalculatorPage } from './emi-calculator.page';
import { EmiCalculatorPageRoutingModule } from './emi-calculator-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    EmiCalculatorPageRoutingModule
  ],
  providers: [
    AppCurrencyPipe
  ],
  declarations: [EmiCalculatorPage]
})
export class EmiCalculatorPageModule { }
