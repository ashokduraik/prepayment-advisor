import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrepaymentPageRoutingModule } from './prepayment-routing.module';
import { PrepaymentPage } from './prepayment.page';
import { PipesModule } from '../../pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    PrepaymentPageRoutingModule
  ],
  declarations: [PrepaymentPage]
})
export class PrepaymentPageModule {}
