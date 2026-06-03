import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AuthService } from './services/auth';

/**
 * APP_INITIALIZER ensures the Supabase session is restored BEFORE the app renders.
 * Without it, the login screen would flash briefly before detecting the session.
 */
function initializeSession(auth: AuthService): () => Promise<void> {
  return () => auth.initSession();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeSession,
      deps: [AuthService],
      multi: true,
    },
  ]
};
