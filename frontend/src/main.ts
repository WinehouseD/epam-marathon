import { bootstrapApplication } from '@angular/platform-browser';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';

import { APP_ROUTES } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { tokenInterceptor } from './app/services/interceptors/token.interceptor';
import { loaderInterceptor } from './app/services/interceptors/loader.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(RouterModule.forRoot(APP_ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules })),
    provideHttpClient(withInterceptors([tokenInterceptor, loaderInterceptor])),
    provideAnimations()
  ]
});
