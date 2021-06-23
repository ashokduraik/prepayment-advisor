import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalculationLogicPageRoutingModule } from './calculation-logic-routing.module';
import { CalculationLogicPage } from './calculation-logic.page';
import { PipesModule } from '../../pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    CalculationLogicPageRoutingModule
  ],
  declarations: [CalculationLogicPage]
})
export class CalculationLogicPageModule {}
