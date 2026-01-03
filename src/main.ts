import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// Ensure Ionic web components are registered when running in the browser
import { defineCustomElements } from '@ionic/core/loader';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// Register Ionic custom elements
defineCustomElements(window as any);

// Global error catcher to help locate runtime chunk failures (parentNode null)
window.addEventListener('error', (ev: ErrorEvent) => {
  try {
    console.error('Global error caught:', ev.message, ev.filename, ev.lineno, ev.colno);
    if (ev.error && ev.error.stack) console.error('Stack:', ev.error.stack);
    const scripts = Array.from(document.scripts || []).map(s => ({ src: s.src, webpack: s.getAttribute('data-webpack') }));
    console.error('Loaded scripts:', scripts);
    // print script elements in readable form
    scripts.forEach(s => console.error('script:', s));
  } catch (e) {
    console.error('Error while logging global error', e);
  }
});

window.addEventListener('unhandledrejection', (ev: PromiseRejectionEvent) => {
  try {
    console.error('Unhandled promise rejection:', ev.reason);
    if (ev.reason && ev.reason.stack) console.error('Rejection stack:', ev.reason.stack);
  } catch (e) {
    console.error('Error while logging unhandledrejection', e);
  }
});
platformBrowserDynamic().bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection()], })
  .catch(err => console.log(err));
