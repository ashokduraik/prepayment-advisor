import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmiProjectionPageRoutingModule } from './emi-projection-routing.module';
import { EmiProjectionPage } from './emi-projection.page';
import { PipesModule } from '../../pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    EmiProjectionPageRoutingModule
  ],
  declarations: [EmiProjectionPage],
})
export class EmiProjectionPageModule { }
