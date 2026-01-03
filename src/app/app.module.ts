import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Ionic Storage removed — using Capacitor Storage (@capacitor/storage)
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HighchartsChartModule } from 'highcharts-angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { EmiEditPage } from './pages/emi-edit/emi-edit.page';
import { LoanBasicComponent } from './pages/loan-basic/loan-basic.component';

import { AmountInputModule } from './directive/amount-input/amount-input.module';
import { CurrencySelectComponent } from './pages/currency-select/currency-select.component';
import { LoanDetailsPopoverComponent } from './pages/loan-details-popover/loan-details-popover.component';

export const myComponents = [
  CurrencySelectComponent,
  LoanDetailsPopoverComponent,
];

@NgModule({
  declarations: [
    AppComponent,
    EmiEditPage,
    LoanBasicComponent,
    ...myComponents,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    HighchartsChartModule,
    ReactiveFormsModule,
    // Capacitor Storage does not require module initialization
    AmountInputModule,
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
