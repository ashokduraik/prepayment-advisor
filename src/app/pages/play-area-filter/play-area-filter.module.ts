import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayAreaFilterPage } from './play-area-filter.page';
import { PlayAreaFilterPageRoutingModule } from './play-area-filter-routing.module';
import { AmountInputModule } from '../../directive/amount-input/amount-input.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AmountInputModule,
    PlayAreaFilterPageRoutingModule
  ],
  declarations: [PlayAreaFilterPage]
})
export class PlayAreaFilterPageModule { }
