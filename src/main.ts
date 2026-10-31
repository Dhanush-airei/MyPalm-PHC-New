import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { defineCustomElements } from '@ionic/pwa-elements/loader';

import { register } from 'swiper/element/bundle';

register();

if (environment.production) {
  enableProdMode();
}

defineCustomElements(window);

platformBrowser()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
