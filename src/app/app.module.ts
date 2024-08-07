import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Drivers } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HighchartsChartModule } from 'highcharts-angular';
import { FileChooser } from '@ionic-native/file-chooser/ngx';

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
    IonicStorageModule.forRoot({
      name: '__ppadb',
      driverOrder: [
        Drivers.IndexedDB,
        'sqlite',
        'websql',
        Drivers.LocalStorage,
      ],
    }),
    AmountInputModule,
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    FileChooser,
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
