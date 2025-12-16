import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';

setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/');

// Suppress AbortError warnings from view transitions
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (args[0]?.message?.includes('Transition was skipped') || 
        args[0]?.name === 'AbortError') {
      return;
    }
    originalError(...args);
  };
}

bootstrapApplication(AppComponent, appConfig).catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
});
