import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Drivers } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { EmiEditPage } from './pages/emi-edit/emi-edit.page';
import { LoanBasicComponent } from './pages/loan-basic/loan-basic.component';

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
  entryComponents: [],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot({
      name: '__ppadb',
      driverOrder: [
        Drivers.IndexedDB,
        'sqlite',
        'websql',
        Drivers.LocalStorage
      ]
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    }),
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }