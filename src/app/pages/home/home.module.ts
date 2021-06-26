import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import { PipesModule } from '../../pipes.module';
import { AppCurrencyPipe } from '../../services/app.pipe';
import { HomePageRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    HomePageRoutingModule
  ],
  providers: [
    AppCurrencyPipe
  ]
})
export class HomePageModule { }
