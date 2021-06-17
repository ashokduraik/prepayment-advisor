import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { LoanBasicComponent } from './loan-basic.component';

@NgModule({
  declarations: [LoanBasicComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ]
})
export class LoanBasicModule { }
