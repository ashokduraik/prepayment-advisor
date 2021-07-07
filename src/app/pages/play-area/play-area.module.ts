import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayAreaPage } from './play-area.page';
import { PipesModule } from '../../pipes.module';
import { PlayAreaPageRoutingModule } from './play-area-routing.module';
import { AmountInputModule } from '../../directive/amount-input/amount-input.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    AmountInputModule,
    PlayAreaPageRoutingModule
  ],
  declarations: [PlayAreaPage]
})
export class PlayAreaPageModule { }
