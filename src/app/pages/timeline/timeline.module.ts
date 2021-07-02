import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { TimelinePage } from './timeline.page';
import { PipesModule } from '../../pipes.module';
import { AppCurrencyPipe } from '../../services/app.pipe';
import { TimelinePageRoutingModule } from './timeline-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    TimelinePageRoutingModule
  ],
  declarations: [TimelinePage],
  providers: [
    DatePipe,
    AppCurrencyPipe
  ],
})
export class TimelinePageModule { }
