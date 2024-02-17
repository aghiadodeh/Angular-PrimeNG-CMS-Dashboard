import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { appRoutes } from './app.routes';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpCacheInterceptorModule } from '@ngneat/cashew';
import { CMS_CONFIGURATION } from '@xangular/cms';
import { AppSharedModule } from '@xangular/cms';
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: CMS_CONFIGURATION,
      useValue: {
        CMS_API_URL: environment.API_URL,
        CMS_PAGE_SIZE: environment.PAGE_SIZE,
        DIALOG_CONFIGURATION: environment.DIALOG_CONFIGURATION,
      },
    },
    importProvidersFrom([
      BrowserModule,
      BrowserAnimationsModule,
      AppSharedModule,
      HttpCacheInterceptorModule.forRoot(),
    ]),
  ],
};
