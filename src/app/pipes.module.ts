import { NgModule } from '@angular/core';

import { SafeHtmlPipe } from './services/app.pipe';
import { AppCurrencyPipe } from './services/app.pipe';
import { monthToYearPipe } from './services/app.pipe';

@NgModule({
	declarations: [
		SafeHtmlPipe,
		monthToYearPipe,
		AppCurrencyPipe
	],
	imports: [],
	exports: [
		SafeHtmlPipe,
		AppCurrencyPipe,
		monthToYearPipe,
	]
})
export class PipesModule { }