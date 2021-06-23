import { NgModule } from '@angular/core';
import { AppCurrencyPipe } from './services/app.pipe';
import { monthToYearPipe } from './services/app.pipe';

@NgModule({
	declarations: [
		monthToYearPipe,
		AppCurrencyPipe
	],
	imports: [],
	exports: [
		AppCurrencyPipe,
		monthToYearPipe,
	]
})
export class PipesModule { }