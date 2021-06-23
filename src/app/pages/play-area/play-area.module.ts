import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayAreaPageRoutingModule } from './play-area-routing.module';
import { PlayAreaPage } from './play-area.page';
import { PipesModule } from '../../pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    PlayAreaPageRoutingModule
  ],
  declarations: [PlayAreaPage]
})
export class PlayAreaPageModule {}
