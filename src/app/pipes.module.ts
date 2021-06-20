import { NgModule } from '@angular/core';
import { AppCurrencyPipe } from './services/app.pipe';

@NgModule({
	declarations: [AppCurrencyPipe],
	imports: [],
	exports: [AppCurrencyPipe]
})
export class PipesModule {}