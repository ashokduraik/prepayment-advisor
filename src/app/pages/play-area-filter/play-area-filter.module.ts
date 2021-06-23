import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayAreaFilterPageRoutingModule } from './play-area-filter-routing.module';

import { PlayAreaFilterPage } from './play-area-filter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayAreaFilterPageRoutingModule
  ],
  declarations: [PlayAreaFilterPage]
})
export class PlayAreaFilterPageModule {}
