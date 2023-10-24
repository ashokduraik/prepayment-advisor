import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PipesModule } from '../../pipes.module';
import { LedgerEntryPage } from './ledger-entry.page';
import { LedgerEntryPageRoutingModule } from './ledger-entry-routing.module'
import { AmountInputModule } from '../../directive/amount-input/amount-input.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    AmountInputModule,
    ReactiveFormsModule,
    LedgerEntryPageRoutingModule
  ],
  declarations: [LedgerEntryPage]
})
export class LedgerEntryPageModule { }
