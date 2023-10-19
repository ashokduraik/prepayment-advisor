import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { DoughnutChart } from "./doughnut-chart.directive";

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    DoughnutChart
  ],
  exports: [
    DoughnutChart
  ],
  providers: [],
})
export class AmountInputModule {
}