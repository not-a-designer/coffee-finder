import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule }                     from '@angular/common';
import { FormsModule }                      from '@angular/forms';
import { Routes, RouterModule }             from '@angular/router';

import { IonicModule }                      from '@ionic/angular';

import { AgmCoreModule }                    from '@agm/core';

import { AdsenseModule }                    from 'ng2-adsense';

import { environment }                      from '@environments/environment';
import { ComponentsModule }                 from '@app-components/components.module';
import { CoffeeMapPage }                    from '@app-pages/coffee-map/coffee-map.page';


const routes: Routes = [{ path: '', component: CoffeeMapPage }];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AgmCoreModule.forRoot({
      apiKey: environment.firebase.apiKey,
      libraries: ['places'],
      language: 'en-US'
    }),
    AdsenseModule.forRoot({
      adClient: environment.adSenseConfig.google_ad_client,
      adSlot: environment.adSenseConfig.google_ad_slot,
      pageLevelAds: environment.adSenseConfig.enable_page_level_ads
    }),
    ComponentsModule
  ],

  declarations: [ CoffeeMapPage ],

  exports: [ CoffeeMapPage ],

  entryComponents: [ CoffeeMapPage ],

  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CoffeeMapPageModule {}
