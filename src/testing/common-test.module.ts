import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PipesModule } from '../app/pipes.module';

@NgModule({
  imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), FormsModule, ReactiveFormsModule, PipesModule],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CommonTestModule {}
