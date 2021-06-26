import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { CurrencySelectComponent } from './currency-select.component';
import { CurrencySelectRoutingModule } from './currency-select-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CurrencySelectRoutingModule
  ],
  declarations: [CurrencySelectComponent]
})
export class SupportPageModule { }
