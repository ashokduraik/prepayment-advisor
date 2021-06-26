import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PipesModule } from '../../pipes.module';
import { StatisticsPage } from './statistics.page';
import { AppCurrencyPipe } from '../../services/app.pipe';
import { StatisticsPageRoutingModule } from './statistics-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    StatisticsPageRoutingModule
  ],
  declarations: [StatisticsPage],
  providers: [AppCurrencyPipe],
})
export class StatisticsPageModule { }
