import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { AppCurrencyPipe } from '../../services/app.pipe';
import { AmountInputDirective } from "./amount-input.directive";

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    AmountInputDirective
  ],
  exports: [
    AmountInputDirective
  ],
  providers: [AppCurrencyPipe],
})
export class AmountInputModule {
}