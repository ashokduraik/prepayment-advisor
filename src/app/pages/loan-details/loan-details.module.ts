import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { LoanDetailsPageRoutingModule } from './loan-details-routing.module';
import { LoanDetailsPage } from './loan-details.page';
import { PipesModule } from '../../pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    LoanDetailsPageRoutingModule
  ],
  declarations: [
    LoanDetailsPage,
  ],
  providers: [
    DatePipe
  ],
})
export class LoanDetailsPageModule {}
